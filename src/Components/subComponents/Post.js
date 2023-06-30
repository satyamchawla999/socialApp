import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { storage } from '../../Firebase';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import "../../Assets/Styles/posts.css"


const Post = () => {
    const [imgUrl, setImgUrl] = useState(null);
    const [progresspercent, setProgresspercent] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault()
        const file = e.target[2]?.files[0]
        setImgUrl(file);

        // if (!file) return;

        // const storageRef = ref(storage, `files/${file.name}`);
        // console.log("sref", storageRef);
        // const uploadTask = uploadBytesResumable(storageRef, file);

        // uploadTask.on("state_changed",
        //     (snapshot) => {
        //         const progress =
        //             Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        //         setProgresspercent(progress);
        //     },
        //     (error) => {
        //         alert(error);
        //     },
        //     () => {
        //         getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //             setImgUrl(downloadURL)
        //             console.log(downloadURL)
        //         });
        //     }
        // );
    }

    const handleChange = (e)=>{
        const file = e.target[2]?.files[0];
        console.log(file)
        setImgUrl(file);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (

        <div className="posts">

            {
                !imgUrl &&
                <div className='outerbar'>
                    <div className='innerbar' style={{ width: `${progresspercent}%` }}>{progresspercent}%</div>
                </div>
            }
            {
                imgUrl &&
                <img src={imgUrl} alt='uploaded file' height={200} />
            }



            <Modal className="modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[]} bodyStyle={{ height: "350px" }} width={700}>
                <div className='addPost'>
                    <form onSubmit={handleSubmit} className='form'>
                        <div className='postForm'>

                            <div className='textBar'>
                                <textarea type="text" name="text" placeholder="What's on your mind?" rows={20} cols={38} />
                                <button type='submit'>Upload</button>
                            </div>

                            <div className='imgSelect'>
                                <input type="file" id="file-input" onClick={handleChange}/>
                                <label id="file-input-label" for="file-input">
                                    <div className='img'>
                                        {imgUrl 
                                            ? <img src={URL.createObjectURL(imgUrl)} alt='uploaded file' />
                                            : <img src={require("../../Assets/Images/upload.png")} style={{padding:"100px"}} />
                                        }
                                    </div>
                                </label>
                            </div>

                        </div>
                    </form>
                </div>
            </Modal>

            <button className='addPostButton' onClick={showModal}>
                &nbsp;+&nbsp;
            </button>
        </div>
    )
}

export default Post;
