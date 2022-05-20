const catalyst = require("zcatalyst-sdk-node");
var Twit = require('twit');
var fs = require('fs');
var T = require('./config.js');

module.exports = async(cronDetails, context) => {

    // var exec = require('child_process').exec;


    var client = new Twit(T);

    await tweetWithImage();

    async function tweetWithImage() {
        await makeImage();
        processing();

        function processing() {
            try {
                console.log('processing now');
                var filename = "sendTwitterImage.png";
                var params = {
                    encoding: 'base64'
                }


                var b64content = fs.readFileSync(filename, params);
                client.post('media/upload', { media_data: b64content }, uploaded);

                function uploaded(err, data, response) {
                    if (err) {
                        console.log('error uploading image');
                        console.log(err);
                    }
                    var id = data.media_id_string;
                    console.log('id is ' + id);

                    var tweet_this = {
                        status: '#upload4mMicroservice ',
                        media_ids: [id]
                    }
                    console.log(tweet_this);
                    client.post('statuses/update', tweet_this, tweeted);
                }
            } catch (e) {

                console.log(e);
                context.closeWithFailure();

            }
        }

        function tweeted(err, data, response) {
            if (err) {
                console.log('something went wrong');
                console.log(err);
                context.closeWithFailure();
            } else {
                console.log('all iz well'); // Tweet body.
                context.closeWithSuccess();
            }
        }


    }

    async function makeImage() {


        const { createCanvas, loadImage } = require('canvas');

        const width = 100
        const height = 100

        const canvas = createCanvas(width, height)
        ctx = canvas.getContext('2d');
        ctx.fillStyle = 'rgba(180,0,0,1)';

        //ctx.fillStyle = "blue";

        ctx.font = '10px Impact';
        ctx.rotate(.1);
        ctx.fillText("Catalyst Easy ", 10, 30);

        //var te = ctx.measureText('Twitter is uber easy');
        ctx.strokeStyle = 'rgba(0,192,192,0.9)';

        ctx.beginPath();

        ctx.lineTo(50, 102);
        //ctx.lineTo(50 + te.width, 102);
        ctx.strokeStyle = "red";

        ctx.stroke();

        const buffer = canvas.toBuffer('image/png')
        fs.writeFileSync(__dirname + '/sendTwitterImage.png', buffer);
    }

    console.log('image created');
}