import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // app.get( "/filteredimage", async (req, res)=>{
  //   res.status(200).send("Hello");
  // });
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get("/filteredimage", async (request: Request, response: Response) => {
    //init vars
    let imageUrl = request.query.image_url;
    imageUrl = imageUrl.toString();

    let fileArray = [];

    //test for empty image url
    if (!imageUrl) {
      response.status(400).send('image url is required');
    }

    //call filter img url
    let fileImage = await filterImageFromURL(imageUrl);

    //test for empty result
    if (!fileImage) {
      response.status(400).send('image could not be processed at this time');
    }

    // add file name to array
    fileArray.push(fileImage);

    //delete local files
    /*
    delete is causing a 504 gateway time out
    <html>
    <head>
      <title>504 Gateway Time-out</title>
    </head>

    <body bgcolor="white">
      <center>
        <h1>504 Gateway Time-out</h1>
      </center>
    </body>

    </html>
    */
    //await deleteLocalFiles(fileArray);

    //return 200 w/ file name    
    response.status(200).sendFile(fileImage, (error) => {
      console.log(error);
    });
  });
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();