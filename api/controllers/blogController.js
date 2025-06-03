import fs from 'fs'
import imageKit from '../configs/imageKit.js';
import Blog from '../models/blog.js';

export const addBlog = async(req,res) => {
    try { 
        // console.log(req.body);
        const {title,subTitle,description,category, isPublished} = JSON.parse(req.body.blog);
        const imageFile = req.file;
   
        // check if all fields are present 
        if(!title || !description || !category || !imageFile ){
            return res.json({success:true,message:"missing required fields"});
        }


        const fileBuffer = fs.readFileSync(imageFile.path)
        const response = await  imageKit.upload({
            file:fileBuffer,
            fileName:imageFile.originalname,
            folder:"/blogs"
        })
        // optimization ythrough imagekit url tranformation
        const optimizedImageUrl = imageKit.url({
            path:response.filePath,
            transformation: [
                {quality:'auot'},//auto compression
                {format:'webp'},// convert to modern format
                {width:'1280'} // width resizing
            ]
        })

        const image = optimizedImageUrl;
        await Blog.create({title,subTitle,description,category,image,isPublished})
        res.json({success:true,message:"blog addedd successfully"});

    } catch (error) {
        res.json({success:false,message:error.message});
    }
}