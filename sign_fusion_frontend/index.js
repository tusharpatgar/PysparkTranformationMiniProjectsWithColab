// Get necessary DOM elements
const videoElement = document.getElementById('gesture-video');
const startButton = document.getElementById('start-btn');
const stopButton = document.getElementById('stop-btn');
const recognizedTextElement = document.getElementById('recognized-text');
document.getElementById('run-final-pred-btn').addEventListener('click', runFinalPrediction);

let stream; // Variable to store the video stream
let handModel; // Store the hand model instance
let previousGesture = ""; // Store the previously recognized gesture

// Load the MediaPipe Hands model
async function loadHandModel() {
    handModel = new window.Hands({
        locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }
    });

    // Set options for the hand model (lower thresholds for faster results)
    handModel.setOptions({
        maxNumHands: 1,  // Detect up to one hand (you can increase this if needed)
        modelComplexity: 1,  // Use a simpler model (faster)
        minDetectionConfidence: 0.3,  // Lower detection threshold
        minTrackingConfidence: 0.3,  // Lower tracking threshold
    });

    // Listen for hand recognition results
    handModel.onResults(onResults);
}

// Function to handle the results from the hand model

function onResults(results) {
    // Clear previous drawing on canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        // Hand landmarks detected, let's process them
        const handLandmarks = results.multiHandLandmarks[0]; // Get the first hand's landmarks
        drawHandLandmarks(ctx, handLandmarks); // Draw landmarks on canvas

        // Perform gesture recognition based on hand landmarks
        const gesture = recognizeGesture(handLandmarks);
        
        // Check if the gesture has changed (to avoid repeating the same gesture)
        if (gesture !== previousGesture) {
            recognizedTextElement.textContent = gesture;
            recognizedTextElement.classList.add('fade-in'); // Add fade-in class for animation
            previousGesture = gesture; // Update the previous gesture
            
            // Optional: Give audio feedback on recognized gesture
            speakGesture(gesture);
        }

    } else {
        recognizedTextElement.textContent = "Waiting for gesture input...";
    }
}


function runFinalPrediction() {
    // Show the loading spinner while waiting for the response
    document.getElementById('loading-spinner').style.display = 'block';

    // Send a request to the Flask backend to run the Python script
    fetch('/run_final_prediction')
        .then(response => {
            // Check if the response is OK (status 200)
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json(); // Parse the JSON response
        })
        .then(data => {
            // Hide the loading spinner when the response is received
            document.getElementById('loading-spinner').style.display = 'none';

            if (data.status === 'success') {
                // On success, navigate to the final prediction page
                openPredictionPage();  // New function to open the page
            } else {
                // Handle error case
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            // Hide the loading spinner in case of an error
            document.getElementById('loading-spinner').style.display = 'none';
            alert('Error: ' + error.message);
        });
}

// Basic gesture recognition (you can expand this with a more sophisticated model)
function recognizeGesture(handLandmarks) {
    // Example logic to recognize "thumbs up"
    const thumbTip = handLandmarks[4];
    const thumbBase = handLandmarks[2];
    const indexTip = handLandmarks[8];
    
    // "Thumbs up" if the thumb tip is above the thumb base and the index is not
    if (thumbTip.y < thumbBase.y && indexTip.y > indexTip.y) {
        return "Thumbs Up!";
    }

    // "Peace sign" if the index and middle fingers are both extended
    const middleTip = handLandmarks[12];
    if (indexTip.y < thumbTip.y && middleTip.y < thumbTip.y) {
        return "Peace Sign!";
    }

    return "Unknown Gesture";
}

// Function to draw hand landmarks on canvas
function drawHandLandmarks(ctx, handLandmarks) {
    handLandmarks.forEach((landmark, index) => {
        const x = landmark.x * videoElement.width;
        const y = landmark.y * videoElement.height;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
    });
}

// Function to start the webcam feed
// Function to start the webcam feed
async function startWebcam() {
    // Show loading spinner while initializing the webcam
    document.getElementById('loading-spinner').style.display = 'block';

    try {
        // Request webcam access
        stream = await navigator.mediaDevices.getUserMedia({ video: true });

        // Set the webcam feed to the video element
        videoElement.srcObject = stream;

        // Disable the start button and enable the stop button
        startButton.disabled = true;
        stopButton.disabled = false;

        console.log("Webcam started successfully");

        // Hide the spinner after webcam starts
        document.getElementById('loading-spinner').style.display = 'none';

        // Start hand model detection
        loadHandModel();

        // Start processing webcam frames
        const webcamStream = videoElement.captureStream();
        const videoTrack = webcamStream.getVideoTracks()[0];
        const imageCapture = new ImageCapture(videoTrack);

        const detectHands = async () => {
            const frame = await imageCapture.grabFrame();
            const frameCanvas = document.createElement("canvas");
            frameCanvas.width = frame.width;
            frameCanvas.height = frame.height;
            const ctx = frameCanvas.getContext("2d");
            ctx.drawImage(frame, 0, 0, frame.width, frame.height);
            handModel.send({ image: frameCanvas });
            requestAnimationFrame(detectHands); // Continuously detect hands
        };

        detectHands();

    } catch (err) {
        console.error("Error accessing webcam:", err);
        alert("Error: Could not access the webcam.");

        // Hide the spinner if there's an error
        document.getElementById('loading-spinner').style.display = 'none';
    }
}

// Function to stop the webcam feed
function stopWebcam() {
    if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach(track => track.stop()); // Stop all tracks
        videoElement.srcObject = null; // Clear the video element
    }

    startButton.disabled = false;
    stopButton.disabled = true;

    console.log("Webcam stopped");
    recognizedTextElement.textContent = "Waiting for gesture input...";
}

// Add event listeners to the buttons
startButton.addEventListener('click', startWebcam);
stopButton.addEventListener('click', stopWebcam);

// Function to speak the recognized gesture using Web Speech API
function speakGesture(gesture) {
    const utterance = new SpeechSynthesisUtterance(gesture);
    speechSynthesis.speak(utterance);
}
