import Applicant from "@/model/Applicant";

export const tinhloiResolver = {
    totalTinhLoi: {
       docs(parent, args) {
        return parent.docs
      }
    },
    TinhLoi: {
       applicant(parent, args){
         return Applicant.findById(parent.applicantId)
      }
    }
  }