import {  useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GlobalContext } from '../../context/GlobalState';
import BeatLoader from "react-spinners/BeatLoader";
import { AiFillEdit } from "react-icons/ai"

const AdminPictures = () => {
    
    const { 
        isLoading,
        getPictures,
        pictures
    } = useContext(GlobalContext);

    const [search, setSearch] = useState('');

    //when component loads
    useEffect(() => {
        getPictures();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function searchChanged(e) {
        setSearch(e.target.value);

        var filter, table, tr, td, i;
        filter = e.target.value.toUpperCase();
        table = document.getElementById("adminPicturesTableBody");
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByClassName("adminPictureAnswer")[0];
            if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }

    }
 
    return (
        <>
            <h2>Daily Pictures</h2>

            <div id="pictureSearchContainer">
                Search
                <input 
                    type="text"  
                    onChange={searchChanged}
                    value={search} 
                /> 
            </div>
        
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
                                <th className="adminPictureEdit"></th>
                            </tr>
                        </thead>
                    </table>
                    <div id="adminPicturesBodyContainer">
                        <table id="adminPicturesTableBody" className="adminPictures">
                            <tbody>
                            { pictures.map(p => {
                                const d = new Date(p.date);
                                return (
                                <tr key={p._id}>
                                    <td className="adminPictureNumber">{p.pictureNumber}</td>
                                    <td className="adminPictureDate">{d.toLocaleDateString()}</td>
                                    <td className="adminPictureAnswer">{p.answer}</td>
                                    <td className="adminPictureAlternativeAnswers">{p.alternativeAnswers.map((a,i) => <div key={i}>{a}</div>)}</td>
                                    <td className="adminPicturePicture"><img src={p.url} alt={p.answer} /></td>
                                    <td className="adminPictureEdit">
                                        <Link to="/admin/pictureForm" state={p}><AiFillEdit /></Link>
                                    </td>
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