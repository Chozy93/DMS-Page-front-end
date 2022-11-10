import http from "../http-common";
class GalleryDataService {

    upload(title,gallery){
        // json 객체 사용 x
        // form 태그로 전송하는 방식을 이용함
        //  html <form></form> == js FormData 객체로 사용가능
        //                        .append("속성명",값) 함수 : 데이터를 저장
        // axios 함수 : .post()
        // 헤더에 :"Content-Type" : "multipart/form-data" 
        let formData = new FormData();
        formData.append("galleryTitle",title);
        formData.append("gallery",gallery);
        return http.post("/gallery/upload",formData,{
            headers:{
                "Content-Type" : "multipart/form-data"
            }
        });
    }

    // 이미지 제목으로 검색 함수

    getFiles(galleryTitle,page,size){
        console.log(galleryTitle);
        console.log(page);
        console.log(size);
        return http.get(`/gallery?galleryTitle=${galleryTitle}&page=${page}&size=${size}`);
        
    }

    // 이미지 삭제요청 함수

    delete(gid){
        return http.delete(`/gallery/deletion/${gid}`);
    }

}

export default new GalleryDataService();