const video = document.querySelector('#video');

Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
]).then(startVideo);

async function startVideo() {
    let stream = null;
    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: true
        });
        video.srcObject = stream;
    } catch (error) {
        console.log(error);
    }
}

video.addEventListener('playing', () => {
        const canvas = faceapi.createCanvasFromMedia(video);   
        document.body.append(canvas);
    
        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);
    
    setInterval(async () => {
           const detections = await faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();    
           console.log(detections);
            if(!detections) {
                return;
            };
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

            faceapi.draw.drawDetections(canvas, resizedDetections);
            faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
     }, 100);    
});


