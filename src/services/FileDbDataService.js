import http from "../http-common";
class FileDbDataService {

    upload(title,content,fileDb){
        // json 객체 사용 x
        // form 태그로 전송하는 방식을 이용함
        //  html <form></form> == js FormData 객체로 사용가능
        //                        .append("속성명",값) 함수 : 데이터를 저장
        // axios 함수 : .post()
        // 헤더에 :"Content-Type" : "multipart/form-data" 
        let formData = new FormData();
        formData.append("fileTitle",title);
        formData.append("fileContent",content);
        formData.append("fileDb",fileDb);
        return http.post("/fileDb/upload",formData,{
            headers:{
                "Content-Type" : "multipart/form-data"
            }
        });
    }

    // 이미지 제목으로 검색 함수

    getFiles(fileTitle,page,size){
        console.log(fileTitle);
        console.log(page);
        console.log(size);
        return http.get(`/fileDb?fileTitle=${fileTitle}&page=${page}&size=${size}`);
        
    }

    // 이미지 삭제요청 함수

    delete(fid){
        return http.delete(`/fileDb/deletion/${fid}`);
    }

}

export default new FileDbDataService();