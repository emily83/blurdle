import React, { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { GlobalContext } from '../../context/GlobalState';
import DatePicker from 'react-date-picker';
import ReactCrop, { makeAspectCrop } from 'react-image-crop'
import { canvasPreview } from '../../utils/canvasPreview'
import { useDebounceEffect } from '../../utils/useDebounceEffect'
import BeatLoader from "react-spinners/BeatLoader";
import 'react-image-crop/dist/ReactCrop.css'

function makeCrop(mediaWidth, mediaHeight, aspect) {
    return makeAspectCrop(
        {
          unit: '%',
          width: 100,
        },
        aspect,
        mediaWidth,
        mediaHeight,
      )
 
}

const AdminAddPicture = () => {
    
    let navigate = useNavigate();

    const { savePicture, isSaving, isSaveSuccessful, error, setError, setIsSaveSuccessful } = useContext(GlobalContext);

    const [pictureDate, setPictureDate] = useState(new Date());
    const [answer, setAnswer] = useState('');

    const [imgSrc, setImgSrc] = useState('')
    const previewCanvasRef = useRef(null)
    const imgRef = useRef(null)
    const [crop, setCrop] = useState()
    const [completedCrop, setCompletedCrop] = useState()
    const aspect = 1;

    useEffect(() => {
      if (isSaveSuccessful) {
        setIsSaveSuccessful(false);
        navigate('/admin');
      }
    }, [isSaveSuccessful]);

    function onSelectFile(e) {
        if (e.target.files && e.target.files.length > 0) {
          setCrop(undefined) // Makes crop preview update between images.
          const reader = new FileReader()
          reader.addEventListener('load', () =>
            setImgSrc(reader.result.toString() || ''),
          )
          reader.readAsDataURL(e.target.files[0])
        }
      }
    
      function onImageLoad(e) {
        if (aspect) {
          const { width, height } = e.currentTarget
          setCrop(makeCrop(width, height, aspect))
        }
      }
    
      useDebounceEffect(
        async () => {
          if (
            completedCrop?.width &&
            completedCrop?.height &&
            imgRef.current &&
            previewCanvasRef.current
          ) {
            // We use canvasPreview as it's much faster than imgPreview.
            canvasPreview(
              imgRef.current,
              previewCanvasRef.current,
              completedCrop
            )
          }
        },
        100,
        [completedCrop],
      )

      function submitForm(e) {
          e.preventDefault();
          if ( !previewCanvasRef.current ) {
            setError('Please select a picture');
            return false;
          }
          if ( !answer ) {
            setError('Please enter answer');
            return false;
          }
          previewCanvasRef.current.toBlob(function(blob){
            const newImage = new File([blob], blob.name, {type: blob.type,});
            savePicture(pictureDate, newImage, answer);
          }, 'image/jpeg', 0.95);         
      }
    
    return (
        <>
            <h2>Add Picture</h2>

            { isSaving && 
              <>
                <div id="savingPictureBlocker"></div>
                <div id="savingPictureSpinner">
                  <span>Saving picture</span>
                  <BeatLoader id="savingPictureLoader" color="var(--primary-colour)" size={30} /> 
                </div>
              </>
            }

            <form id="pictureForm">

              { error && <div id="pictureFormError">{error}</div> }

                <div className="formControl">
                    <label htmlFor="pictureDate">Date</label>
                    <DatePicker 
                        format="dd/MM/y"
                        showLeadingZeros={true}
                        id="pictureDate" 
                        onChange={setPictureDate} 
                        value={pictureDate} 
                    />                   
                </div>
                <div className="formControl">
                    <label htmlFor="picture">Picture</label>
                    <input type="file" accept="image/*" onChange={onSelectFile} />
                
                    <div className="pictureSelection">
                        {Boolean(imgSrc) && (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={aspect}
                            >
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}

                        {Boolean(completedCrop) && (
                        <canvas
                            ref={previewCanvasRef}
                            style={{
                            border: '1px solid black',
                            objectFit: 'contain',
                            width: 300,
                            height: 300,
                            }}
                        />
                        )}
                    </div>
                </div>

                <div className="formControl">
                    <label htmlFor="pictureAnswer">Answer</label>
                    <input type="text" 
                        id="pictureAnswer" 
                        onChange={ (event) => setAnswer(event.target.value) }
                        value={answer} 
                    />                   
                </div>

                <button onClick={(e)=>submitForm(e)} className="adminBtn">Save</button>

            </form> 

        </>
    )
}

export default AdminAddPicture