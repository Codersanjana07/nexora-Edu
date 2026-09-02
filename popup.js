document.addEventListener('DOMContentLoaded',()=> {
    let timerDisplay=document.getElementById('timer');
    let startBtn=document.getElementById('startBtn');
    let aiBtn=document.getElementById('aiBtn');
    let noteInput=document.getElementById('noteInput');
    let responseBox=document.getElementById('aiResponsebox');
    let responseDisplay=document.getElementById('aiResponse');
    let timeLeft=30*60;
    let timeId=null;

    function PlayBeepSound () {
        try {
            let msg=new SpeechSynthesisUtterance();
            msg.text= "Focuse session complete that Outstanding job!";
            msg.lang= "en-US";
            msg.rate=1.0;
            window.SpeechSynthesis.speak(msg);
                } catch (e) {
                   console.log("Speech not supported");
                }        
            }
            if (startBtn)
                startBtm.addEventListener('click',() => {
            if (timerId==null){
            startBtn.innerText="Push Session";
            startBtn.style.backgroundColor="#d97706";
            timeId=setInterval(() => {
                if (timeLeft  <=0) {
                    clearInterval(timeId);
                }
                PlayBeepSound();
                alert("Focus Session complete! outstanding Job!")
                timeLeft=30*60;
                timeId=null;
                startBtn.innerText="Start Focus";
                startBtn.style.backgroundColor="#4f46e5";
                timerDisplay.innerText="30:00";
            } else {
              timeLeft--;
              let minutes=Math.floor(timeLeft/60);
              let seconds=timeLeft/60;
              timerDisplay.innerText=`${minutes}:${seconds < 10 ? '0' :''}${seconds}`;
            }
        },1000);
    }   else{
        clearInterval(timerId);

    }




            }
            }})      

})