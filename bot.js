var Slack = require('@slack/client').RtmClient;
var Google = require('google-search');
var tarr = ['xox','KHv9pKuR6xtjlblEQ','68989711'];
var keywords =['hello','Hello','hi','Hi','hey','Hey','привіт'];
var slack = new Slack(tarr[0] + 'b-'+ tarr[2] + '381-' + 'u3qii' + tarr[1] + 'xe');
var google = new Google({
  key: 'AIzaSyDg8BrKk3dToPvjhGN4Jh7VTg88Sk1rRos',
  cx: '003723743698426983621:zzcg2v3dobs'
});

slack.on('open', function() {
    console.log('Connected');

});

slack.on('message', function(message) {
  if (message.user == null) return; // Ignore bot's own messages

    var user = slack.dataStore.getUserById(message.user)
    var dm = slack.dataStore.getDMByName(user.name);
    var channel = slack.dataStore.getChannelGroupOrDMById(message.channel);
    var text = message.text;
    console.log('- received message from: @'+ user.name);
    console.log('- message: '+ text);

    var findex  = text.indexOf('find');
    var hindex = -1;
    var kwindex =0;
    for (var i in keywords) {
      hindex = text.indexOf(keywords[i]);
      if(hindex > -1)
      {
        kwindex =i;
        break;
      }
    }
    if (hindex> -1)
    {
      slack.sendMessage(keywords[kwindex] + ' @' + user.name + '!\n My name is bobo and I could help you to find something if you want. \n Please use command <find>', dm.id);
    }
    else if (findex> -1)
    {
      slack.sendMessage('I am searching it, please wait a sec...', dm.id);
      var stext = text.substr(findex + 5, text.length);
       console.log('- searching: ' + stext);
        google.build({
          q: stext//,
          //num: 10, // Number of search results to return between 1 and 10, inclusive
          }, function(error, response) {

            var items = response.items;
            if (items == null || items.length == 0)
            {
              slack.sendMessage('I am sorry, could not find anything :(', dm.id);
              return;
            }
            slack.sendMessage( '@'+ user.name +', please check results below: \n', dm.id);
            for (var i in items)
             {
               val = items[i];
               slack.sendMessage( '\n\n\n' + val.title +'\n' + val.snippet +'\n'+val.link, dm.id);
            }
        });

    }
    else {
      slack.sendMessage('I am sorry @'+ user.name +' I am not very smart yet. I can only recognise hello and find words', dm.id);
    }

    // More goes here later..
});

slack.start();
