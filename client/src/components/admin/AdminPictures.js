import {  useContext, useEffect } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import BeatLoader from "react-spinners/BeatLoader";

const AdminPictures = () => {
    
    const { 
        isLoading,
        getPictures,
        pictures
    } = useContext(GlobalContext);

    
    //when component loads
    useEffect(() => {
        getPictures();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <h2>Daily Pictures</h2>
        
            { isLoading && <BeatLoader id="mainLoader" color="#fff" size={20} css={`margin-top:50px`} /> }
            { !isLoading && 
                <>
                    <table className="adminPictures">
                        <thead>
                            <tr>
                                <th className="adminPictureNumber">Picture No.</th>
                                <th className="adminPictureDate">Date</th>                              
                                <th className="adminPictureAnswer">Answer</th>
                                <th className="adminPictureAlternativeAnswers">Alternative Answers</th>
                                <th className="adminPicturePicture">Picture</th>
                            </tr>
                        </thead>
                    </table>
                    <div id="adminPicturesBodyContainer">
                        <table className="adminPictures">
                            <tbody>
                            { pictures.slice(0).reverse().map(p => {
                                const d = new Date(p.date);
                                return (
                                <tr key={p._id}>
                                    <td className="adminPictureNumber">{p.pictureNumber}</td>
                                    <td className="adminPictureDate">{d.toLocaleDateString()}</td>
                                    <td className="adminPictureAnswer">{p.answer}</td>
                                    <td className="adminPictureAlternativeAnswers">{p.alternativeAnswers.map((a,i) => <div key={i}>{a}</div>)}</td>
                                    <td className="adminPicturePicture"><img src={p.url} alt={p.answer} /></td>
                                </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </>
    )
}

export default AdminPictures