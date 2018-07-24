App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('WETH9.json', function(data) {
      var Weth9Artifact = data;
      let contract = TruffleContract(Weth9Artifact);
      contract.setProvider(App.web3Provider);

      contract.deployed().then(function(instance) {
        App.contracts.Weth9 = instance;
      });
    });
    $.getJSON('ScamToken.json', function(data) {
      var ScamTokenArtifact = data;
      let contract = TruffleContract(ScamTokenArtifact);
      contract.setProvider(App.web3Provider);

      contract.deployed().then(function(instance) {
        App.contracts.ScamToken = instance;
      });
    });

    $.getJSON('ScamICO.json', function(data) {
      var ICOArtifact = data;
      let contract = TruffleContract(ICOArtifact);
      contract.setProvider(App.web3Provider);

      contract.deployed().then(function(instance) {
        App.contracts.ScamICO = instance;

        web3.eth.getAccounts(function(error, accounts) {
          if (error) {
            console.log(error);
          }
          App.account = accounts[0];
          // For now just reload screen when someone pledges
          instance.GoalReached().watch(function() {
            console.log("GoalReached");
            App.getSaleStatus(accounts[0])
          });
          instance.ScamWithdraw().watch(function() {
            console.log("ScamWithdraw");
            App.getSaleStatus(accounts[0])
          });
          return App.getSaleStatus(accounts[0]);
        });
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-donate', App.handleDonate);
    $(document).on('click', '.btn-claim', App.handleClaim);
  },

  getSaleStatus: function(account) {
    App.contracts.ScamICO.totalInvested().then(function(totalInvested) {
      let remaining = 10000-(totalInvested * 10)
      $('#remaining').text(remaining);
      $('.slider').attr("max",remaining);
    });
    App._setText(App.contracts.ScamICO.amountInvested(account, {from: account})
      .then(function(amount) {return amount * 10}), $('#pledged')).
      then(function() {
        App.contracts.ScamICO.ended().then(function(stage) {
          if (stage > 0) {
            $('#status').text("Sale Complete");
            $('#pledge').hide();
            $('#claim .btn-claim').attr('disabled', ($('#pledged').text() == 0))
            $('#claim').show();
          } else {
            $('#status').text("Sale Running");
            $('#pledge').show();
          }
        });
      });
    App._setText(App.contracts.ScamICO.amountInvested(account, {from: account})
      .then(function(amount) {return amount * 10}), $('#claimed'));
  },

  handleDonate: function(event) {
    event.preventDefault();
    let amount = parseInt($('#slider-value').text()) / 10.0;
    console.log("Convert ETH to WETH");
    return App.contracts.Weth9.deposit({value: amount * 10**18, from: App.account}).then(function() {
        console.log("Approve ScamICO for same amount of WETH");
        return App.contracts.Weth9.approve(App.contracts.ScamICO.address, amount, {from: App.account});
    }).then(function() {
      console.log("Deposit WETH into ScamICO");
      return App.contracts.ScamICO.invest(amount, {from: App.account});
    });
  },


  handleClaim: function(event) {
    event.preventDefault();
    console.log("Redeem SCM tokens");
    App.contracts.ScamICO.withdrawSCM();
  },

  _setText: function(future, target) {
    return future.then(function(result) {
      target.text(result);
    }).catch(function(err) {
      console.log(err.message);
    });
  }

};


$(function() {
  $(window).load(function() {
    App.init();

    var slider = document.getElementById("myRange");
    var output = document.getElementById("slider-value");
    output.innerHTML = slider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
      output.innerHTML = this.value;
  }
  });
});
