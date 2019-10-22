/* ALLG1 TEACHING ONLINE EXPERIMENTS
 * mapping the blindspot  --  post-experiment blindspot map
  * 2019
  */

 jsPsych.plugins["allg1-stroopres"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "allg1-stroopres",
      parameters: {

      }
    }
  
    plugin.trial = function(display_element, trial) {

        // create divs to draw stims in
        divs = {}

        responses    = jsPsych.data.get().filter({trial_type: 'allg1-stroop'}).values();
        respMatch    = jsPsych.data.get().filter({trial_type: 'allg1-stroop', cond: 'match', acc: true, isPractice: false}).values().map(function(x){ return x.RT; });
        respMismatch = jsPsych.data.get().filter({trial_type: 'allg1-stroop', cond: 'mismatch', acc: true, isPractice: false}).values().map(function(x){ return x.RT; });

        matchMean    = respMatch.reduce(function(sum,next){ return sum + next}, 0) / respMatch.length;
        mismatchMean = respMismatch.reduce(function(sum,next){ return sum + next}, 0) / respMismatch.length;

        xVals = ['match (' + respMatch.length + ' samples)',
                  'mismatch (' + respMismatch.length + ' samples)'];
        yVals = [matchMean, mismatchMean];

        var plotDiv = document.createElement("div");
        plotDiv.style.width  = window.innerWidth * 0.5 + "px";
        plotDiv.style.height = window.innerHeight * 0.5 + "px";
        plotDiv.setAttribute("class","center-div");
        display_element.appendChild(plotDiv);

        Plotly.plot(
          plotDiv, 
          [{
            x: xVals,
            y: yVals,
            type: 'bar'
          }],
          {
            margin: { t: 100 },
            title: 'Reaction time comparison (valid trials)',
            yaxis: {
              title: 'Avg RT (ms)'
            },
            xaxis: {
              title: 'Condition'
            }
          });

        var dlBut = document.createElement("div");
        dlBut.style.height = 0.1 * window.innerHeight + "px";
        dlBut.style.left = "50%" ;
        dlBut.innerHTML = "<br><input id='clickMe' type='button' value='Download in CSV format' onclick='downloadData();' />";
        dlBut.setAttribute("class","center-div");
        display_element.appendChild(dlBut);

        var dlBut = document.createElement("div");
        dlBut.style.height = 0.1 * window.innerHeight + "px";
        dlBut.style.left = "50%" ;
        dlBut.innerHTML = "Press <b>P</b> to finish.";
        dlBut.setAttribute("class","center-div");
        display_element.appendChild(dlBut);

        var next = function(){
          jsPsych.finishTrial({});
        }


        jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: next,
            valid_responses: ['p'],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

    };
  
    return plugin;
  })();
  