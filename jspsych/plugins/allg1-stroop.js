/* ALLG1 TEACHING ONLINE EXPERIMENTS
 * stroop task
 * 2019
 */

 jsPsych.plugins["allg1-stroop"] = (function() {

    var plugin = {};
  
    plugin.info = {
      name: "allg1-stroop",
      parameters: {
        cond: {
            type: jsPsych.plugins.parameterType.STRING, // match/mismatch
            default: undefined
        },
        totalTrials: {
            type: jsPsych.plugins.parameterType.INT,    // total amount of trials
            default: undefined
        },
        isPractice: {
            type: jsPsych.plugins.parameterType.BOOL,
            defualt: false
        }
      }
    }
  
    plugin.trial = function(display_element, trial) {

        var cond        = trial.cond;
        var totalTrials = trial.totalTrials;

        var colors = ['yellow', 'green', 'purple']; 
        var keys   = [72,        74,      75     ];  // h j k

        var indices = jsPsych.randomization.sampleWithoutReplacement([0,1,2], 2)
        var color1  = colors[indices[0]];  // word that is being displayed
        var color2;  // text color (correct answer)
        var correctIndex;

        switch (cond){
            case ('match'):
                color2 = color1;
                correctIndex = indices[0];
                break;
            case ('mismatch'):
                color2 = colors[indices[1]];
                correctIndex = indices[1];
                break;
        }

        var trialData = {
            cond: cond,
            color1: color1,
            color2: color2,
            trialNumber: trialNumber
        }

        var endTrial = function(info){
            trialData["RT"]  = info.rt;
            trialData["acc"] = info.key == keys[correctIndex];
            display_element.removeChild(stim);
            trialNumber++;
            jsPsych.finishTrial(trialData);
        }

        var stim;

        // todo: add jitter
        var waitDrawTarget = function(){
            jsPsych.pluginAPI.setTimeout(function(){
                // execute this block after timeout
                stim = document.createElement('div');
                stim.style.left  = window.innerWidth * 0.5 - window.innerWidth * 0.1 + "px";
                stim.style.width = window.innerWidth * 0.2 + "px";
                stim.style.color = color2;
                stim.innerHTML   = color1;
                stim.setAttribute('class', 'stim');
                display_element.appendChild(stim);

                jsPsych.pluginAPI.getKeyboardResponse({
                    callback_function: endTrial,
                    valid_responses: ['h', 'j', 'k'],
                    rt_method: 'performance',
                    persist: false,
                    allow_held_key: false
                });
            },
            Math.random() * 500 + 500  // 500 ms time before word onset
            )
        }

        waitDrawTarget();

    };
  
    return plugin;
  })();
  