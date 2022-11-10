// CustomerDataService.js
// 목적 : Customer 정보를 axios 로 CRUD 를 하는 공통 함수들 정의
import http from "../http-common";

class CustomerDataService {
    // 모든 부서정보 조회 요청 함수
    getAll(email, page, size) {
        // get 방식 통신 요청 -> @GetMapping("/api/customer")
        return http.get(`/customer?email=${email}&page=${page}&size=${size}`); 
    }

    // 부서번호로 조회 요청 함수
    // get 방식 통신 요청 -> @GetMapping("/api/customer/{no}"), @PathVariable
    get(no) {
        return http.get(`/customer/${no}`)
    }

    // 부서정보 생성(insert) 요청 함수
    // post 방식 통신 요청 -> @PostMapping("/api/customer"), @RequestBody
    create(data) {
        
        console.log(data);
        return http.post("/customer", data);
    }

    // 부서정보 수정(update) 요청 함수
    // put 방식 통신 요청 -> @PutMapping("/api/customer/{no}"), @RequestBody
    update(cid, data) {
        return http.put(`/customer/${cid}`, data);
    }

    // 부서정보 삭제(delete) 요청 함수
    // delete 방식 통신 요청 -> @DeleteMapping("/api/customer/deletion/{no}")
    //                        , @PathVariable  
    delete(cid) {
        return http.delete(`/customer/deletion/${cid}`);
    }

   

    // 부서명 검색 요청 함수
    // 쿼리스트링 방식 url : ?변수명=값&변수명2=값2....
    // get 방식 통신 요청 -> @GetMapping("/api/customer") , @RequestParam
    // findByTitle(email) {
    //     return http.get(`/customer?email=${email}`);
    // }

}

export default new CustomerDataService();