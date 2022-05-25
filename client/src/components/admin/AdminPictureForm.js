import React, { useContext, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";
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
    const location = useLocation();

    const { savePicture, isSaving, isSaveSuccessful, error, setError, setIsSaveSuccessful } = useContext(GlobalContext);
    const pictureId = location.state ? location.state._id : null;
    const [pictureDate, setPictureDate] = useState( location.state ? new Date( location.state.date ) : new Date() );
    const [answer, setAnswer] = useState( location.state ? location.state.answer : '' );
    const [alternativeAnswers, setAlternativeAnswers] = useState( location.state && location.state.alternativeAnswers.length ? location.state.alternativeAnswers : ['']);
    const [imgSrc, setImgSrc] = useState(location.state ? location.state.url : '' );
    const previewCanvasRef = useRef(null);
    const imgRef = useRef(null);
    const fileInputRef = useRef(null);
    const [crop, setCrop] = useState();
    const [completedCrop, setCompletedCrop] = useState();
    const aspect = 1;

    useEffect(() => {
      window.addEventListener('paste', e => {
        fileInputRef.current.files = e.clipboardData.files;
        fileSelected(fileInputRef.current);
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
      if (isSaveSuccessful) {
        setIsSaveSuccessful(false);
        navigate('/admin');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSaveSuccessful]);

    function onSelectFile(e) {      
      fileSelected(e.target);
    }

    function fileSelected(fileInput) {
      if (fileInput.files && fileInput.files.length > 0) {
        setCrop(undefined) // Makes crop preview update between images.
        const reader = new FileReader()
        reader.addEventListener('load', () =>
          setImgSrc(reader.result.toString() || ''),
        )
        reader.readAsDataURL(fileInput.files[0])
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

          const altAns = alternativeAnswers.filter((a) => a);

          let isNewImage = true;
          if ( location.state ) {
            if ( location.state.url === imgSrc ) {
              isNewImage = false;
            }
          }
          if (isNewImage) {
            previewCanvasRef.current.toBlob(function(blob){
              const newImage = new File([blob], blob.name, {type: blob.type,});          
              savePicture( pictureId, pictureDate, isNewImage, newImage, answer, altAns);
            }, 'image/jpeg', 0.95);      
          } else {
            savePicture( pictureId, pictureDate, isNewImage, '', answer, altAns);
          }
   
      }

      const handeAltAnswerChange = (e, index) => {
        const { value } = e.target;
        const list = [...alternativeAnswers];
        list[index] = value;
        setAlternativeAnswers(list);
      };
       
      // handle click event of the Remove button
      const handeAltAnswerRemoveClick = index => {
        const list = [...alternativeAnswers];
        list.splice(index, 1);
        setAlternativeAnswers(list);
      };
       
      // handle click event of the Add button
      const handeAltAnswerAddClick = () => {
        setAlternativeAnswers([...alternativeAnswers, '']);
      };
    
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
                    <div className="formData">
                      <DatePicker 
                          format="dd/MM/y"
                          showLeadingZeros={true}
                          id="pictureDate" 
                          onChange={setPictureDate} 
                          value={pictureDate} 
                      />  
                    </div>                 
                </div>
                <div className="formControl">
                    <label htmlFor="picture">Picture</label>
                    <div className="formData">
                      <input 
                        type="file" 
                        ref={fileInputRef}
                        accept="image/*" 
                        onChange={onSelectFile} 
                      />
                
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
                </div>

                <div className="formControl">
                    <label htmlFor="pictureAnswer">Answer</label>
                    <div className="formData">
                      <input 
                          type="text" 
                          id="pictureAnswer" 
                          onChange={ (event) => setAnswer(event.target.value) }
                          value={answer} 
                      />    
                    </div>               
                </div>

                <div className="formControl">
                    <label>Alternative Answers</label>
                    <div className="formData">
                      { alternativeAnswers.map((x, i) => {
                        return (
                          <div className="altAnswerSection" key={i}>
                            <input
                              type="text"
                              name="alternativeAnswer"
                              value={x}
                              onChange={e => handeAltAnswerChange(e, i)}
                            />
                            <div className="btn-box">
                              {alternativeAnswers.length !== 1 && <button className="altAnswerRemove" onClick={() => handeAltAnswerRemoveClick(i)}>Remove</button>}
                              {alternativeAnswers.length - 1 === i && <button className="altAnswerAdd" onClick={handeAltAnswerAddClick}>Add</button>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                </div>

                <button onClick={(e)=>submitForm(e)} className="adminBtn">Save</button>

            </form> 

        </>
    )
}

export default AdminAddPicture