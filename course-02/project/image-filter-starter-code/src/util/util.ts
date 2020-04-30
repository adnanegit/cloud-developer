import fs from 'fs';
import Jimp from 'jimp';
import * as path from 'path';


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string>{
    return new Promise( async resolve => {
        const photo = await Jimp.read(inputURL);
        const outpath = path.join('/tmp/','filtered.'+Math.floor(Math.random() * 2000)+'.jpg'); 
        fs.chmod(path.join(__dirname, outpath),777, ()=>{
            console.log('chmod success!');
            console.log(path.join(__dirname,outpath));
        }) ;
        
        photo
            .resize(256, 256) // resize
            .quality(60) // set JPEG quality
            .greyscale(); // set greyscale
            /*.write(outpath,(img)=>{
                resolve(path.join(__dirname,outpath));
            })*/
        await photo.writeAsync(path.join(__dirname, outpath));
        resolve(path.join(__dirname,outpath));
    });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files:Array<string>){
    if(files && files.length>0){
        for( let file of files) {
            fs.unlinkSync(file);
        }
    }
    
}