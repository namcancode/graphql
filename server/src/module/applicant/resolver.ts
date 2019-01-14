import Applicant from '@/model/Applicant'

export const applicantQuery = {
  applicant(root, { id }) {
    return Applicant.findById(id)
  },
  listApplicant(root, { filter, pagination }) {
    const options = { sort: '-createdAt', lean: true, ...pagination }
    return Applicant.paginate({ ...filter }, options)
  }
}

export const applicantMutation = {}

export const applicantResolver = {
  totalApplicant: {
    docs(parent, args) {
      return parent.docs
    }
  }
}
