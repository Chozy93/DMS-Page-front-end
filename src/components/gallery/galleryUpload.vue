<template>
  <div>
    <div class="col-md-8">
      <div class="input-group mb-3">
        <!-- 검색어 입력 -->
        <input
          type="text"
          class="form-control"
          placeholder="Search by Title"
          v-model="searchTitle"
        />
        <!-- 검색어 버튼 -->
        <div class="input-group-append">
          <button
            class="btn btn-outline-secondary"
            type="button"
            @click="
              page = 1;
              retrieveFileDb();
            "
          >
            Search
          </button>
        </div>
      </div>
    </div>

    <div class="row justify-content-md-center">
      <div class="col-12">
        <!-- 페이징 + 전체 목록 시작 -->
        <!-- 페이징 양식 시작 -->
        <div class="col-md-12">
          <!-- 셀렉트 박스 : 기본 페이지 변경 -->
          <!-- change :  handlePageSizeChange($event), 1페이지당 개수 변경 시 실행되는 이벤트-->
          <!--           $event : html 태그의 기본 이벤트, 이 객체로 현재 선택 또는 클릭한 html태그(양식)를 알 수 있음.
                     event.target (현재 사용자가 선택한 양식(여기서는 셀렉트 박스내 목록을 의미 ) -->
          <div class="mb-3">
            Items per Page:
            <select v-model="pageSize" @change="handlePageSizeChange($event)">
              <option v-for="size in pageSizes" :key="size" :value="size">
                {{ size }}
              </option>
            </select>
          </div>

          <!-- b-pagination : 부트스트랩 - 페이지 번호 컨트롤 -->
          <!-- total-rows : 전체 데이터 개수 -->
          <!-- per-page : 1페이지 당 개수 -->
          <!-- change : handlePageChange(), 페이지 번호 변경 시 실행되는 이벤트 -->
          <b-pagination
            v-model="page"
            :total-rows="count"
            :per-page="pageSize"
            prev-text="Prev"
            next-text="Next"
            @change="handlePageChange"
          ></b-pagination>
        </div>
        <!-- 페이징 양식 끝 -->
      </div>
    </div>

    <!-- 이미지명(galleryTitle) 입력박스 시작 -->
    <div class="mb-3 col-md-5">
      <label for="galleryTitle" class="form-label">이미지명</label>
      <input
        type="text"
        class="form-control"
        id="galleryTitle"
        required
        name="galleryTitle"
        v-model="galleryTitle"
        
      />
    </div>
    <!-- 이미지명(galleryTitle) 입력박스 끝 -->

    <!-- 이미지 선택상자 시작 -->
    <div class="mb-3 col-md-5">
      <label class="btn btn-default p-0">
        <!-- 파일 선택상자 -->
        <input type="file" accept="image/*" ref="file" @change="selectImage" />
      </label>
    </div>
    <!-- 이미지 선택상자 끝 -->

    <!-- 업로드 버튼 insert문 실행 -->
    <div class="mb-3">
      <!-- 서버에 insert 문 호출 -->
      <button
        class="btn btn-success btn-sm float-left"
        :disabled="!currentImage"
        @click="upload"
      >
        Upload
      </button>
    </div>
    <!-- 업로드 버튼 insert문 실행 끝-->

    <!-- 미리보기 이미지 시작 -->
    <div v-if="previewImage">
      <div>
        <img class="preview my-3" :src="previewImage" alt="" />
      </div>
    </div>
    <!-- 미리보기 이미지 끝 -->

    <!-- 서버 에러 메세지가 있을 경우 아래 출력 시작 -->
    <div v-if="message" class="alert alert-secondary" role="alert">
      {{ message }}
    </div>
    <!-- 서버 에러 메세지가 있을 경우 아래 출력 끝 -->

    <!-- 쇼핑 카트 형태 디자인 시작 -->
    <!-- v-for 시작 -->
    <div class="row">
      <div class="col-sm-4" v-for="(data, index) in gallery" :key="index">
        <div class="card">
          <img :src="data.galleryUrl" class="card-img-top" alt="강의" />
          <div class="card-body">
            <h5 class="card-title">{{ data.galleryTitle }}</h5>
            <a @click="deleteImage(data.gid)">
              <i class="fas fa-trash" />
              <button class="badge bg-danger">Delete</button>
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- 쇼핑 카트 형태 디자인 끝 -->
  </div>
</template>

<script>
import galleryDataService from "../../services/GalleryDataService";
export default {
  data() {
    return {
      currentImage: undefined,
      previewImage: undefined,
      message: "", //서버에서 날아올 메세지를 저장할 변수
      
      gallery: [],
      searchTitle: "",
      galleryTitle: "",
      gid: null,
      galleryUrl: "",

      page: 1, // 현재 페이지
      count: 0, // 전체 데이터 건수
      pageSize: 3, // 한페이지당 몇개를 화면에 보여줄지 결정하는 변수
      pageSizes: [3, 6, 9],
    };
  },
  methods: {
    retrieveFileDb() {
      galleryDataService.getFiles(this.searchTitle, this.page-1, this.pageSize)
        // 성공하면 .then() 결과가 전송됨
        .then((response) => {
          // this.dept = response.data ->(변경) const { dept, totalItems } = response.data
          // let(const) {속성명, 속성명2} = 데이터객체배열 (모던자바문법 구조분해할당)
         const { gallery, totalItems } = response.data; // springboot 의 전송된 맵 정보
         this.gallery = gallery;        // 스프링부트에서 전송한 데이터
         this.count = totalItems; // 스프링부트에서 전송한 페이지정보(총 건수)

          // 디버깅 콘솔에 정보 출력
          console.log(response.data);
        })
        // 실패하면 .catch() 에 에러가 전송됨
        .catch((e) => {
          console.log(e);
        });
    },
    selectImage(){
        this.currentImage=this.$refs.file.files.item(0); //선택이미지를 변수에 저장
        this.previewImage= URL.createObjectURL(this.currentImage); //이미지 주소만 참조하여 이미지 보여주기 함수
        this.message="";
    },
    upload(){
        galleryDataService.upload(this.galleryTitle,this.currentImage)
        .then((response)=>{
            this.message = response.data.message;
            //화면에 재조회 요청
            return galleryDataService.getFiles(
                this.searchTitle,
                this.page -1,
                this.pageSize
            );
        })
        .then((response2)=>{
            const{gallery,totalItems} = response2.data;
            this.gallery =gallery;
            this.count=totalItems;
            this.previewImage= undefined;
            console.log(response2);
        })
        .catch((e)=>{
            this.message = "Could not upload this image!" +e;
            this.currentImage = undefined;
        })
    },
    handlePageSizeChange(event) {
      this.pageSize = event.target.value; // 한페이지당 개수 저장(3, 6, 9)
      this.page =1;
      // 재조회 함수 호출
      this.retrieveFileDb();
    },
    // 페이지 번호 변경시 실행되는 함수(재조회)
    handlePageChange(value) {
      this.page = value; // 매개변수값으로 현재페이지 변경
      // 재조회 함수 호출
      this.retrieveFileDb();
    },
    deleteImage(gid){
      // axios 공통함수 호출
      galleryDataService.delete(gid)
      // 성공하면 then() 결과가 전송됨
      .then(response => {
        console.log(response.data);
        // 첫페이지(전체목록_조회_페이지) 강제 이동 : /qna 
        this.message ="정상적으로 삭제되었습니다.";
        this.retrieveFileDb()
      })
      // 실패하면 .catch() 에러메세지가 전송됨
      .catch(e => {
        console.log(e);
        this.message ="삭제 중 에러가 발생되었습니다.";
      });
    }

  },
  mounted() {
    this.retrieveFileDb(); // 화면 로딩시 전체 조회함수 실행
  },
};
</script>

<style>
.preview{
  max-width: 200px;
}
</style>