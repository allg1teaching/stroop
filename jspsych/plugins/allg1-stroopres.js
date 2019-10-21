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
        respMatch    = jsPsych.data.get().filter({trial_type: 'allg1-stroop', cond: 'match', acc: true}).values().map(function(x){ return x.RT; });
        respMismatch = jsPsych.data.get().filter({trial_type: 'allg1-stroop', cond: 'mismatch', acc: true}).values().map(function(x){ return x.RT; });

        matchMean    = respMatch.reduce(function(sum,next){ return sum + next}, 0) / respMatch.length;
        mismatchMean = respMismatch.reduce(function(sum,next){ return sum + next}, 0) / respMismatch.length;

        xVals = ['match (' + respMatch.length + ' samples)',
                  'mismatch (' + respMismatch.length + ' samples)'];
        yVals = [matchMean, mismatchMean];

        var plotDiv = document.createElement("div");
        plotDiv.style.width  = window.innerWidth * 0.5 + "px";
        plotDiv.style.height = window.innerHeight * 0.5 + "px";
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

        var next = function(){
          jsPsych.finishTrial({});
        }


        jsPsych.pluginAPI.getKeyboardResponse({
            callback_function: next,
            valid_responses: ['space'],
            rt_method: 'performance',
            persist: false,
            allow_held_key: false
        });

    };
  
    return plugin;
  })();
  