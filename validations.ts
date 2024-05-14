import moment from "moment";
import Messages from "./messages";
// import Constants from "./constants";

const emailRegex =
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regEmail = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const codeRegex = /^\d+$/;
const upper = /[A-Z]/;
const lower = /[a-z]/;
const number = /[0-9]/;
const special = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; // eslint-disable-line
const removeSpecial = /^[/.a-zA-Z0-9,!? ]*$/;

const validUrls = [
  "BlogsView",
  "BrandsView",
  "DealsView",
  "EducationView",
  "EventsAndClassesView",
  "PerksProgramView",
  "SolaGenius",
  "ToolsAndResourcesView",
  "MySolaProView",
  "VideosView",
];

// const validUrlsPattern = new RegExp(
//   "^(https?:\\/\\/)?" + // protocol
//     "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
//     "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
//     "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
//     "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
//     "(\\#[-a-z\\d_]*)?$",
//   "i"
// ); // fragment locator

function isURL(str: any) {
  const urlRegex =
    /^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/i;
  const url = new RegExp(urlRegex);
  return str.length < 2083 && url.test(str);
}

const countWords = (str: any) => {
  const string = str
    .replace(/(^\s*)|(\s*$)/gi, "")
    .replace(/[ ]{2,}/gi, " ")
    .replace(/\n /, "\n");
  return string.split(" ").length;
};

const validatePhoneNumber = (phone: any) => phone?.replace(/[^\w\s]/gi, "").replace(/[\s]/gi, "");

const Validations = {
  // Faqs Valiation
  validateFaqsForm: (data: any) => {
    const errors: any = {};
    if (!data?.question) {
      errors.question = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.answer) {
      errors.answer = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateAmenitiesForm: (data: any) => {
    const errors: any = {};
    if (!data?.headline) {
      errors.headline = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.description) {
      errors.description = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.icon) {
      errors.icon = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateEmail: (value: any) => {
    let error;
    if (!value) {
      error = Messages.ERROR.ADD_EMAIL;
    } else if (!emailRegex.test(value)) {
      error = Messages.ERROR.VALID_EMAIL;
    }
    return error;
  },
  validateLoginForm: (data: any) => {
    const errors: any = {};
    if (!data?.email) {
      errors.email = Messages.ERROR.ADD_EMAIL;
    } else if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.password) {
      errors.password = Messages.ERROR.ADD_PASSWORD;
    }
    return errors;
  },
  validateRegisterForm: (data: any) => {
    const errors: any = {};
    if (!data?.email) {
      errors.email = Messages.ERROR.ADD_EMAIL;
    } else if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    return errors;
  },
  validateForgotPassword: (data: any) => {
    const errors: any = {};
    if (!data?.email) {
      errors.email = Messages.ERROR.ADD_EMAIL;
    } else if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    return errors;
  },
  validateCreatePassword: (data: any) => {
    const errors: any = {};
    if (!data?.code) {
      errors.code = Messages.ERROR.ADD_VERIFICATION_CODE;
    } else if (!codeRegex.test(data?.code)) {
      errors.code = Messages.ERROR.VALID_VERIFICATION_CODE;
    }

    if (!data?.password) {
      errors.password = Messages.ERROR.ADD_PASSWORD;
    } else if (data?.password?.length < 8) {
      errors.password = Messages.ERROR.PASSWORD_LENGTH;
    } else if (!upper.test(data?.password)) {
      errors.password = Messages.ERROR.PASSWORD_UPPERCASE;
    } else if (!lower.test(data?.password)) {
      errors.password = Messages.ERROR.PASSWORD_LOWERCASE;
    } else if (!number.test(data?.password)) {
      errors.password = Messages.ERROR.PASSWORD_NUMBER;
    }
    return errors;
  },
  validatePassword: (password: any, cnfpassword: any = null) => {
    const errors: any = {};
    if (password?.length < 8) {
      errors.length = Messages.ERROR.PASSWORD_LENGTH;
    }
    if (!upper.test(password)) {
      errors.uppercase = Messages.ERROR.PASSWORD_UPPERCASE;
    }
    if (!lower.test(password)) {
      errors.lowercase = Messages.ERROR.PASSWORD_LOWERCASE;
    }
    if (!number.test(password)) {
      errors.number = Messages.ERROR.PASSWORD_NUMBER;
    }
    if (!special.test(password)) {
      errors.special = Messages.ERROR.PASSWORD_SPECIAL;
    }
    if (cnfpassword && cnfpassword !== password) {
      errors.confirm = Messages.ERROR.PASSWORD_CONFIRM;
    }
    return errors;
  },
  validateMenuForm: (data: any) => {
    const errors: any = {};
    if (!data?.alias) {
      errors.alias = Messages.ERROR.ALIAS;
    }
    if (!data?.display_menu) {
      errors.displayMenu = Messages.ERROR.DISPLAY_NAME;
    }
    if (!data?.menu_order) {
      errors.order = Messages.ERROR.MENU_ORDER;
    } else if (data?.menu_order <= 0) {
      errors.order = Messages.ERROR.MIN_MENU_ORDER;
    } else if (data?.order_exists) {
      errors.order = Messages.ERROR.ALREADY_MENU_ORDER;
    }
    return errors;
  },

  validatePageSectionForm: (data: any) => {
    const errors: any = {};
    if (!data?.alias) {
      errors.alias = Messages.ERROR.ALIAS;
    }
    if (!data?.display_menu) {
      errors.displayMenu = Messages.ERROR.DISPLAY_NAME;
    }
    return errors;
  },

  validateRoleForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.ADD_NAME;
    }
    if (data?.menuIds?.length < 1) {
      errors.menuIds = Messages.ERROR.SELECT_MENUS;
    }
    return errors;
  },

  validateConnectUserForm: (data: any) => {
    const errors: any = {};
    if (!data?.firstName) {
      errors.firstName = Messages.ERROR.ADD_NAME;
    }
    if (!data?.lastName) {
      errors.lastName = Messages.ERROR.ADD_NAME;
    }
    if (!data?.email) {
      errors.email = Messages.ERROR.ADD_EMAIL;
    } else if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if ("role" in data && !data?.role) {
      errors.role = Messages.ERROR.FIELD_REQUIRED;
    }
    if (
      (data?.work_start_hour && !data?.work_end_hour) ||
      (!data?.work_start_hour && data?.work_end_hour)
    ) {
      errors.workHours = Messages.ERROR.REQUIRED_WORK_HOURS;
    }
    if (data?.work_start_hour && data?.work_end_hour) {
      const start = moment(data?.work_start_hour);
      const end = moment(data?.work_end_hour);
      if (end.diff(start, "minutes") <= 0) {
        errors.workHours = Messages.ERROR.WORK_HOURS;
      }
      if (!data?.userTimezone) {
        errors.workHours = Messages.ERROR.REQUIRED_TIMEZONE;
      }
    }
    return errors;
  },

  validateMSAForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.url_name) {
      errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.url_name?.length > 255) {
      errors.url_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.legacy_id?.length > 255) {
      errors.legacy_id = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },

  validateLease: (data: any) => {
    const errors: any = {};
    if (data?.step === 0) {
      if (!data?.first_name) {
        errors.first_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.last_name) {
        errors.last_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.dob) {
        errors.dob = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.phone) {
        errors.phone = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.email) {
        errors.email = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.email)) {
        errors.email = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.emergency_contact_name) {
        errors.emergency_contact_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.emergency_relationship) {
        errors.emergency_relationship = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.emergency_phonenumber) {
        errors.emergency_phonenumber = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.professional_license_lumber) {
        errors.professional_license_lumber = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.services || (data?.services && !data?.services?.length)) {
        errors.services = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.referred_by) {
        errors.referred_by = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.hear_about_sola) {
        errors.hear_about_sola = Messages.ERROR.FIELD_REQUIRED;
      }
    } else if (data?.step === 1) {
      if (!data?.mailing_address_1) {
        errors.mailing_address_1 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.mailing_city) {
        errors.mailing_city = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.mailing_state) {
        errors.mailing_state = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.mailing_zip) {
        errors.mailing_zip = Messages.ERROR.FIELD_REQUIRED;
      }
    } else if (data?.step === 3) {
      if (!data?.digital_signature) {
        errors.digital_signature = Messages.ERROR.FIELD_REQUIRED;
      }
    } else if (data?.step === 4) {
      if (!data?.billing_type) {
        errors.billing_type = Messages.ERROR.FIELD_REQUIRED;
      }
      if (data?.billing_type === "card") {
        if (!data?.card_name) {
          errors.card_name = Messages.ERROR.FIELD_REQUIRED;
        }
        if (!data?.card_number) {
          errors.card_number = Messages.ERROR.FIELD_REQUIRED;
        }
        if (!data?.card_exp_mm_yy) {
          errors.card_exp_mm_yy = Messages.ERROR.FIELD_REQUIRED;
        } else if (data?.card_exp_mm_yy?.length !== 5) {
          errors.card_exp_mm_yy = Messages.ERROR.VALID_VALUE;
        }
      } else if (data?.billing_type === "bank_transfer") {
        if (!data?.bank_name) {
          errors.bank_name = Messages.ERROR.FIELD_REQUIRED;
        }
        if (!data?.bank_account) {
          errors.bank_account = Messages.ERROR.FIELD_REQUIRED;
        }
        if (!data?.bank_routing) {
          errors.bank_routing = Messages.ERROR.FIELD_REQUIRED;
        }
      }
    } else if (data?.step === 5) {
      if (!data?.billing_address_1) {
        errors.billing_address_1 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.billing_city) {
        errors.billing_city = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.billing_state) {
        errors.billing_state = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.billing_zip) {
        errors.billing_zip = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    return errors;
  },
  validateBlogForm: (data: any) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.title?.length > 255) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.url_name) {
      errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.url_name?.length > 255) {
      errors.url_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.countries || !data?.countries?.length) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.canonical_url && data?.canonical_url?.length > 255) {
      errors.canonical_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.author && data?.author?.length > 255) {
      errors.author = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.carousel_text && data?.carousel_text?.length > 255) {
      errors.carousel_text = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.status) {
      errors.status = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateSola10kForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name && data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.instagram_handle && data?.instagram_handle?.length > 255) {
      errors.instagram_handle = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.original_image_url) {
      errors.image = Messages.ERROR.IMAGE_UPLOAD_ERROR;
    }
    if (!data?.generated_image_url) {
      errors.generated_image = Messages.ERROR.IMAGE_UPLOAD_ERROR;
    }
    return errors;
  },
  validateHomeButtonForm: (data: any) => {
    const errors: any = {};
    if (!data?.action_link) {
      errors.action_link = Messages.ERROR.FIELD_REQUIRED;
    } else if (!isURL(data?.action_link) && !validUrls.includes(data?.action_link)) {
      errors.action_link = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (!data?.position) {
      errors.position = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.country_name || data?.country_name?.length <= 0) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.image_original_url) {
      errors.image = Messages.ERROR.IMAGE_UPLOAD_ERROR;
    }
    return errors;
  },
  validateHomeHeroImagesForm: (data: any) => {
    const errors: any = {};
    if (data?.action_link && !isURL(data?.action_link) && !validUrls.includes(data?.action_link)) {
      // if (errors.action_link) delete errors.action_link;
      errors.action_link = Messages.ERROR.INVALID_ACTION_LINK;
    }

    // else {
    //   errors.action_link = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    if (!data?.position) {
      errors.position = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.countries || data?.countries?.length <= 0) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.image_original_url) {
      errors.image = Messages.ERROR.IMAGE_UPLOAD_ERROR;
    }
    return errors;
  },
  validateClassImagesForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name && data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateProductInfoForm: (data: any) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.title?.length > 35) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_35_ERROR;
    }
    if (data?.link_url?.length > 255) {
      errors.link_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateSolaProLeads: (data: any) => {
    const errors: any = {};
    if (!data?.firstname) {
      errors.firstname = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.firstname && (data?.firstname?.length < 1 || data?.firstname?.length > 255)) {
      errors.firstname = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR_LEADS;
    }
    if (!data?.lastname) {
      errors.lastname = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.lastname && (data?.lastname?.length < 1 || data?.lastname?.length > 255)) {
      errors.lastname = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR_LEADS;
    }
    /* if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.name && (data?.name?.length < 3 || data?.name?.length > 255)) {
      errors.name = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR;
    } */
    if (!data?.email) {
      errors.email = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.email && !regEmail.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.location?.name) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.phone) {
      errors.phone = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateContactInquiries: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.name && (data?.name?.length < 3 || data?.name?.length > 255)) {
      errors.name = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR;
    }
    /* if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.name && (data?.name?.length < 3 || data?.name?.length > 255)) {
      errors.name = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR;
    } */
    if (!data?.email) {
      errors.email = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.email && !emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.location?.name) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.phone) {
      errors.phone = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.how_can_we_help_you) {
      errors.how_can_we_help_you = Messages.ERROR.FIELD_REQUIRED;
    }
    if (
      data?.how_can_we_help_you &&
      data?.how_can_we_help_you !== "Other" &&
      !data?.services?.length
    ) {
      errors.services = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.message) {
      errors.message = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateContactInquiriesOldCms: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.name && (data?.name?.length < 3 || data?.name?.length > 255)) {
      errors.name = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR;
    }
    if (!data?.email) {
      errors.email = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.email && !emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.phone) {
      errors.phone = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.how_can_we_help_you) {
      errors.how_can_we_help_you = Messages.ERROR.FIELD_REQUIRED;
    }
    if (
      data?.how_can_we_help_you &&
      data?.how_can_we_help_you !== "Other" &&
      !data?.services?.length
    ) {
      errors.services = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },

  validateArticleForm: (data: any, imagePreview: string) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.title?.length > 255) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.article_url) {
      errors.article_url = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.image && !imagePreview) {
      errors.image = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateAccountWizard: (data: any) => {
    const errors: any = {};
    if (data?.step === 0) {
      if (!data?.sola_pro_id) {
        errors.sola_pro_id = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.first_name) {
        errors.first_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.last_name) {
        errors.last_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.personal_email) {
        errors.personal_email = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.personal_email)) {
        errors.personal_email = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.personal_phone) {
        errors.personal_phone = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.services || (data?.services && !data?.services?.length)) {
        errors.services = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (data?.step === 1) {
      if (!data?.business_name) {
        errors.business_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.business_url) {
        errors.business_url = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.business_description) {
        errors.business_description = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.business_work_hours) {
        errors.business_work_hours = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    return errors;
  },
  validateReportsForm: (data: any) => {
    const errors: any = {};
    if (!data?.email_address) {
      errors.email_address = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!emailRegex.test(data?.email_address)) {
      errors.email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.report_type) {
      errors.report_type = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.parameters?.length > 255) {
      errors.parameters = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateLocationWizard: (data: any) => {
    const errors: any = {};
    if (data?.step === 0) {
      if (!data?.sola_id) {
        errors.sola_id = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.website_name) {
        errors.website_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.sort_name) {
        errors.sort_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.manager) {
        errors.manager = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.manager_email) {
        errors.manager_email = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.manager_email)) {
        errors.manager_email = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.default_bank) {
        errors.default_bank = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.address_1) {
        errors.address_1 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.address_2) {
        errors.address_2 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.city) {
        errors.city = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.state) {
        errors.state = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.zip) {
        errors.zip = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (data?.step === 2) {
      if (!data?.property_manager_email) {
        errors.property_manager_email = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.business_name) {
        errors.business_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.incorporation_state) {
        errors.incorporation_state = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.notice_address) {
        errors.notice_address = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.fee_collection_day) {
        errors.fee_collection_day = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.early_termination_fee) {
        errors.early_termination_fee = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (data?.step === 3) {
      if (!data?.from_email_address) {
        errors.from_email_address = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.from_email_address)) {
        errors.from_email_address = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.to_email_address) {
        errors.to_email_address = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.to_email_address)) {
        errors.to_email_address = Messages.ERROR.VALID_EMAIL;
      }
    }
    if (data?.step === 4) {
      if (!data?.rent_period) {
        errors.rent_period = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.rent_due_date) {
        errors.rent_due_date = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_team) {
        errors.lease_team = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.security_deposite_amount) {
        errors.security_deposite_amount = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_charge_frequency) {
        errors.insurance_charge_frequency = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_due) {
        errors.insurance_due = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_term) {
        errors.insurance_term = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_fee) {
        errors.insurance_fee = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_sign) {
        errors.lease_sign = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_start) {
        errors.lease_start = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_end) {
        errors.lease_end = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.first_payment_date) {
        errors.first_payment_date = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_first_payment_date) {
        errors.insurance_first_payment_date = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_anniversary) {
        errors.insurance_anniversary = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    return errors;
  },
  solaProLeaseApplicationWizard: (data: any) => {
    const errors: any = {};
    if (data?.step === 1) {
      if (!data?.applicant_name) {
        errors.applicant_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.applicant_email) {
        errors.applicant_email = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.applicant_email)) {
        errors.applicant_email = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.location) {
        errors.location = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.unit) {
        errors.unit = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.move_in_date) {
        errors.move_in_date = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.weeks_free_rent) {
        errors.weeks_free_rent = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.months_free_insurance) {
        errors.months_free_insurance = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    return errors;
  },
  validateLocationFranchiseViewWizard: (data: any) => {
    const errors: any = {};
    if (data?.step === 0) {
      if (!data?.first_name) {
        errors.first_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.last_name) {
        errors.last_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.cms_login) {
        errors.cms_login = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.location_msa) {
        errors.location_msa = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.location_display_name) {
        errors.location_display_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.location_instagram_name) {
        errors.location_instagram_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.location_facebook_name) {
        errors.location_facebook_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.location_hubspot_login) {
        errors.location_hubspot_login = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.location_hubspot_sale_email) {
        errors.location_hubspot_sale_email = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.location_hubspot_sale_email)) {
        errors.location_hubspot_sale_email = Messages.ERROR.VALID_EMAIL;
      }
    }
    if (data?.step === 1) {
      if (!data?.address_1) {
        errors.address_1 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.address_2) {
        errors.address_2 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.city) {
        errors.city = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.state) {
        errors.state = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.zipcode) {
        errors.zipcode = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.country_id) {
        errors.country_id = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (data?.step === 2) {
      if (!data?.location_description) {
        errors.location_description = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (data?.step === 3) {
      if (!data?.existing_location) {
        errors.existing_location = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (data?.step === 4) {
      if (!data?.leasing_manager_first_name) {
        errors.leasing_manager_first_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.leasing_manager_last_name) {
        errors.leasing_manager_last_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.leasing_manager_email) {
        errors.leasing_manager_email = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.leasing_manager_email)) {
        errors.leasing_manager_email = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.leasing_manager_phone) {
        errors.leasing_manager_phone = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    return errors;
  },
  validateSideMenuForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.action_link) {
      errors.action_link = Messages.ERROR.FIELD_REQUIRED;
    }
    if (validUrls.includes(data?.action_link)) {
      // if (validUrlsPattern.test(data?.action_link) || validUrls.includes(data?.action_link)) {
      if (errors.action_link) delete errors.action_link;
    } else {
      errors.action_link = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (!data?.position) {
      errors.position = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.countries || data?.countries?.length <= 0) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateDealsForm: (data: any) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.title?.length > 35) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_35_ERROR;
    }
    if (!data?.description) {
      errors.description = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.countries || data?.countries?.length <= 0) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.more_info_url?.length > 255) {
      errors.more_info_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateRockbotForm: (data: any) => {
    const errors: any = {};
    if (data?.step === 0) {
      if (!data?.full_name) {
        errors.full_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.email) {
        errors.email = Messages.ERROR.FIELD_REQUIRED;
      } else if (!emailRegex.test(data?.email)) {
        errors.email = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.phone_number) {
        errors.phone_number = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.business_name) {
        errors.business_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.location_id) {
        errors.location_id = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (data?.step === 1) {
      if (!data?.media_player || (data?.media_player && !data?.media_player?.length)) {
        errors.media_player = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    return errors;
  },
  validateWebsitesForm: (data: any) => {
    const errors: any = {};
    if (data?.biography) {
      const countWord = countWords(data?.biography);
      if (countWord > 400) {
        errors.biography = Messages.ERROR.TOO_LONG;
      }
    }
    // if (!data?.name) {
    //   errors.name = Messages.ERROR.FIELD_REQUIRED;
    // }
    if (!data?.f_name) {
      errors.f_name = Messages.ERROR.FIELD_REQUIRED;
    }
    // if (!data?.l_name) {
    //   errors.l_name = Messages.ERROR.FIELD_REQUIRED;
    // }
    if (!data?.email_address) {
      errors.email_address = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!emailRegex.test(data?.email_address)) {
      errors.email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.facebook_url?.length > 255) {
      errors.facebook_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.google_plus_url?.length > 255) {
      errors.google_plus_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.instagram_url?.length > 255) {
      errors.instagram_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.linkedin_url?.length > 255) {
      errors.linkedin_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.pinterest_url?.length > 255) {
      errors.pinterest_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.twitter_url?.length > 255) {
      errors.twitter_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.yelp_url?.length > 255) {
      errors.yelp_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.tik_tok_url?.length > 255) {
      errors.tik_tok_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    /* if (data?.testimonials) {
      Object.keys(data?.testimonials).forEach((val) => {
        if (data?.testimonials[val]) {
          if (!data?.testimonials[val].text) {
            errors[val] = Messages.ERROR.FIELD_REQUIRED;
          }
        }
      });
    } */
    return errors;
  },
  validateEducationHeroImagesForm: (data: any) => {
    const errors: any = {};
    if (data?.action_link?.length > 255) {
      errors.action_link = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.position) {
      errors.position = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.image_original_url) {
      errors.image = Messages.ERROR.IMAGE_UPLOAD_ERROR;
    }
    if (!data?.countries || data?.countries?.length <= 0) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateCategoryForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.slug?.length > 255) {
      errors.slug = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateLegacyAdminForm: (data: any) => {
    const errors: any = {};

    if (!data?.email) {
      errors.email = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.email_address) {
      errors.email_address = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!emailRegex.test(data?.email_address)) {
      errors.email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.password) {
      errors.password = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.password_confirmation) {
      errors.password_confirmation = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.password !== data?.password_confirmation) {
      errors.password_confirmation = Messages.ERROR.PASSWORD_NOT_MATCH;
    }
    if (data?.id && !data?.password) {
      delete errors.password;
    }
    if (data?.id && !data?.password && !data?.password_confirmation) {
      delete errors.password_confirmation;
    }
    if (data?.password?.length > 255) {
      errors.password = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.password_confirmation?.length > 255) {
      errors.password_confirmation = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.mailchimp_api_key?.length > 255) {
      errors.mailchimp_api_key = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.callfire_app_login?.length > 255) {
      errors.callfire_app_login = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.callfire_app_password?.length > 255) {
      errors.callfire_app_password = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateRegionsForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.position) {
      errors.position = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.countries_name || data?.countries_name?.length <= 0) {
      errors.countries_name = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateVideosForm: (data: any) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.title?.length > 50) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_50_ERROR;
    }
    if (!data?.youtube_url) {
      errors.youtube_url = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.youtube_url?.length > 255) {
      errors.youtube_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.brand) {
      errors.brand = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.countries || (data?.countries && !data?.countries.length)) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateNotificationForm: (data: any) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.title?.length > 65) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_65_ERROR;
    }
    // if (!data?.send_at) {
    //   errors.send_at = Messages.ERROR.FIELD_REQUIRED;
    // }
    if (!data?.notification_text) {
      errors.notification_text = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.notification_text?.length > 235) {
      errors.notification_text = Messages.ERROR.FIELD_STRING_LENGTH_235_ERROR;
    }
    return errors;
  },
  validateBrandsForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 50) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_50_ERROR;
    }
    if (data?.website_url?.length > 255) {
      errors.website_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.introduction_video_heading_title?.length > 255) {
      errors.introduction_video_heading_title = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.events_and_classes_heading_title?.length > 255) {
      errors.events_and_classes_heading_title = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.countries || !data?.countries.length) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateStateRegionsForm: (data: any) => {
    const errors: any = {};
    if (!data?.sola_class_region) {
      errors.sola_class_region = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.state) {
      errors.state = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateExternalForm: (data: any) => {
    const errors: any = {};
    if (!data?.objectable_id && !data?.location_objectable_id) {
      errors.objectable_id = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.objectable_type) {
      errors.objectable_type = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.kind) {
      errors.kind = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.value) {
      errors.value = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.rm_location_id) {
      errors.rm_location_id = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateFranchiseeInquiryForm: (data: any) => {
    const errors: any = {};
    if (!data?.first_name) {
      errors.first_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.last_name) {
      errors.last_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.email_address) {
      errors.email_address = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.phone_number) {
      errors.phone_number = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.liquid_capital) {
      errors.liquid_capital = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.city) {
      errors.city = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.state) {
      errors.state = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.country) {
      errors.country = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateFranchiseeBlogForm: (data: any) => {
    const errors: any = {};
    if (!data?.kind) {
      errors.kind = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.url) {
      errors.url = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.summary) {
      errors.summary = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.body) {
      errors.body = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.countries === null) {
      errors.countries = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateToolForm: (data: any) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.title?.length > 35) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_35_ERROR;
    }
    if (!data?.countries_name || data?.countries_name?.length <= 0) {
      errors.countries_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.link_url?.length > 255) {
      errors.link_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.youtube_url?.length > 255) {
      errors.youtube_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateTagsForm: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validatePartnerInquiriesForm: (data: any) => {
    const errors: any = {};
    if (!data?.subject) {
      errors.subject = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.subject?.length > 255) {
      errors.subject = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.company_name?.length > 255) {
      errors.company_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.email) {
      errors.email = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.message) {
      errors.message = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.request_url?.length > 255) {
      errors.request_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateStylistMessages: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.message) {
      errors.message = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.stylist) {
      errors.stylist = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateBookingForm: (data: any) => {
    const errors: any = {};
    if (!data?.from) {
      errors.from = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.to) {
      errors.to = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.location_id) {
      errors.location_id = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.query?.length > 255) {
      errors.query = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.stylist_id) {
      errors.stylist_id = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.booking_user_name) {
      errors.booking_user_name = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.booking_user_name?.length > 255) {
      errors.booking_user_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.booking_user_phone?.length > 255) {
      errors.booking_user_phone = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.referring_url?.length > 255) {
      errors.referring_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.booking_user_email) {
      errors.booking_user_email = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.booking_user_email?.length > 255) {
      errors.booking_user_email = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }

    return errors;
  },
  validateStylistUnits: (data: any) => {
    const errors: any = {};
    if (!data?.stylist) {
      errors.stylist = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateEventsAndClasses: (data: any) => {
    const errors: any = {};
    if (!data?.title) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.title?.length > 255) {
      errors.title = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }

    if (!data?.description) {
      errors.description = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.cost?.length > 40) {
      errors.cost = Messages.ERROR.FIELD_STRING_LENGTH_40_ERROR;
    }
    if (data?.link_text?.length > 255) {
      errors.link_text = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.link_url?.length > 255) {
      errors.link_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.start_date) {
      errors.start_date = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.end_date) {
      errors.end_date = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.sola_class_region_id) {
      errors.sola_class_region_id = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.location?.length > 40) {
      errors.location = Messages.ERROR.FIELD_STRING_LENGTH_40_ERROR;
    }
    if (data?.address?.length > 255) {
      errors.address = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.city) {
      errors.city = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.city?.length > 40) {
      errors.city = Messages.ERROR.FIELD_STRING_LENGTH_40_ERROR;
    }
    if (!data?.state) {
      errors.state = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.state?.length > 40) {
      errors.state = Messages.ERROR.FIELD_STRING_LENGTH_40_ERROR;
    }
    if (data?.rsvp_email_address && !emailRegex.test(data?.rsvp_email_address)) {
      errors.rsvp_email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.rsvp_email_address?.length > 35) {
      errors.rsvp_email_address = Messages.ERROR.FIELD_STRING_LENGTH_35_ERROR;
    }
    return errors;
  },
  validateCmsLocationWizard: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.name && data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.url_name) {
      errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.msa?.name) {
      errors.msa = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.store_id && data?.store_id?.length > 255) {
      errors.store_id = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.general_contact_name && data?.general_contact_name?.length > 255) {
      errors.general_contact_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.general_contact_email && !emailRegex.test(data?.general_contact_email)) {
      errors.general_contact_email = Messages.ERROR.VALID_EMAIL;
    }

    if (
      data?.email_address_for_inquiries?.trim() &&
      !emailRegex.test(data?.email_address_for_inquiries)
    ) {
      errors.email_address_for_inquiries = Messages.ERROR.VALID_EMAIL;
    }
    if (
      data?.email_address_for_reports?.trim() &&
      !emailRegex.test(data?.email_address_for_reports)
    ) {
      errors.email_address_for_reports = Messages.ERROR.VALID_EMAIL;
    }
    if (
      data?.email_address_for_hubspot?.trim() &&
      !emailRegex.test(data?.email_address_for_hubspot)
    ) {
      errors.email_address_for_hubspot = Messages.ERROR.VALID_EMAIL;
    }
    if (
      data?.emails_for_stylist_website_approvals?.trim() &&
      !emailRegex.test(data?.emails_for_stylist_website_approvals)
    ) {
      errors.emails_for_stylist_website_approvals = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.phone_number && data?.phone_number?.length > 255) {
      errors.phone_number = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.address_1 && data?.address_1?.length > 255) {
      errors.address_1 = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.address_2 && data?.address_2?.length > 255) {
      errors.address_2 = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.city && data?.city?.length > 255) {
      errors.city = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.state && data?.state?.length > 255) {
      errors.state = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.postal_code && data?.postal_code?.length > 255) {
      errors.postal_code = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.facebook_url && data?.facebook_url?.length > 255) {
      errors.facebook_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.instagram_url && data?.instagram_url?.length > 255) {
      errors.instagram_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.twitter_url && data?.twitter_url?.length > 255) {
      errors.twitter_url = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.rent_manager_property_id && data?.rent_manager_property_id?.length > 255) {
      errors.rent_manager_property_id = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.rent_manager_location_id && data?.rent_manager_location_id?.length > 255) {
      errors.rent_manager_location_id = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateSolaProfessionalsForm: (data: any) => {
    const errors: any = {};
    if (!data?.f_name) {
      errors.f_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.f_name && data?.f_name?.length > 255) {
      errors.f_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.m_name && data?.m_name?.length > 255) {
      errors.m_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.l_name && data?.l_name?.length > 255) {
      errors.l_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.url_name) {
      errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.url_name && data?.url_name?.length > 255) {
      errors.url_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    // else if (!validUrlsPattern.test(data?.url_name)) {
    //   errors.url_name = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    if (!data?.status) {
      errors.status = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.phone_number && data?.phone_number?.length > 255) {
      errors.phone_number = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.email_address?.trim()) {
      errors.email_address = Messages.ERROR.FIELD_REQUIRED;
    } else if (!emailRegex.test(data?.email_address)) {
      errors.email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.business_name && data?.business_name?.length > 255) {
      errors.business_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.studio_number && data?.studio_number?.length > 255) {
      errors.studio_number = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }

    if (data?.website_url && data?.website_url?.length > 255) {
      errors.website_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.booking_url && data?.booking_url?.length > 255) {
      errors.booking_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.facebook_url && data?.facebook_url?.length > 255) {
      errors.facebook_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.google_plus_url && data?.google_plus_url?.length > 255) {
      errors.google_plus_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.instagram_url && data?.instagram_url?.length > 255) {
      errors.instagram_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.linkedin_url && data?.linkedin_url?.length > 255) {
      errors.linkedin_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.pinterest_url && data?.pinterest_url?.length > 255) {
      errors.pinterest_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.twitter_url && data?.twitter_url?.length > 255) {
      errors.twitter_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.yelp_url && data?.yelp_url?.length > 255) {
      errors.yelp_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.tik_tok_url && data?.tik_tok_url?.length > 255) {
      errors.tik_tok_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    // if (data?.website_url && !validUrlsPattern.test(data?.website_url)) {
    //   errors.website_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.booking_url && !validUrlsPattern.test(data?.booking_url)) {
    //   errors.booking_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.facebook_url && !validUrlsPattern.test(data?.facebook_url)) {
    //   errors.facebook_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.google_plus_url && !validUrlsPattern.test(data?.google_plus_url)) {
    //   errors.google_plus_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.instagram_url && !validUrlsPattern.test(data?.instagram_url)) {
    //   errors.instagram_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.linkedin_url && !validUrlsPattern.test(data?.linkedin_url)) {
    //   errors.linkedin_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.pinterest_url && !validUrlsPattern.test(data?.pinterest_url)) {
    //   errors.pinterest_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.twitter_url && !validUrlsPattern.test(data?.twitter_url)) {
    //   errors.twitter_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.yelp_url && !validUrlsPattern.test(data?.yelp_url)) {
    //   errors.yelp_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    // if (data?.tik_tok_url && !validUrlsPattern.test(data?.tik_tok_url)) {
    //   errors.tik_tok_url = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    if (data?.other_service.trim() && data?.other_service?.length > 255) {
      errors.other_service = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    } else if (!removeSpecial.test(data?.other_service)) {
      errors.other_service = Messages.ERROR.REMOVE_SPECIAL_CHARACTER;
    }
    // if (
    //   !data?.barber &&
    //   !data?.botox &&
    //   !data?.brows &&
    //   !data?.hair &&
    //   !data?.hair_extensions &&
    //   !data?.laser_hair_removal &&
    //   !data?.eyelash_extensions &&
    //   !data?.makeup &&
    //   !data?.massage &&
    //   !data?.microblading &&
    //   !data?.nails &&
    //   !data?.permanent_makeup &&
    //   !data?.skin &&
    //   !data?.tanning &&
    //   !data?.teeth_whitening &&
    //   !data?.threading &&
    //   !data?.waxing
    // ) {
    //   errors.services = Messages.ERROR.SELECT_ATLEAST_ONE_SERVICE;
    // }
    for (let i = 1; i <= 10; i++) {
      if (
        data[`testimonial_${i}`] &&
        (data[`testimonial_${i}`]?.name || data[`testimonial_${i}`].region) &&
        !data[`testimonial_${i}`]?.text
      ) {
        errors[`testimonial_${i}_text`] = Messages.ERROR.FIELD_REQUIRED;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.name &&
        data[`testimonial_${i}`]?.name?.length > 255
      ) {
        errors[`testimonial_${i}_name`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.region &&
        data[`testimonial_${i}`]?.region?.length > 255
      ) {
        errors[`testimonial_${i}_region`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
    }
    if (data?.password && data?.password?.length > 255) {
      errors.password = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    } else if (data?.password && !data?.password_confirmation) {
      errors.password_confirmation = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.password_confirmation && !data?.password) {
      errors.password = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.password_confirmation && data?.password_confirmation?.length > 255) {
      errors.password_confirmation = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.password && data?.password_confirmation) {
      if (data?.password !== data?.password_confirmation) {
        errors.password_confirmation = Messages.ERROR.PASSWORD_NOT_MATCH;
      }
    }
    if (data?.billing_first_name && data?.billing_first_name?.length > 255) {
      errors.billing_first_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.billing_last_name && data?.billing_last_name?.length > 255) {
      errors.billing_last_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.billing_email && !emailRegex.test(data?.billing_email)) {
      errors.billing_email = Messages.ERROR.VALID_EMAIL;
    }
    return errors;
  },
  validateSolaProfessionalsGeneralForm: (data: any) => {
    const errors: any = {};
    if (!data?.f_name) {
      errors.f_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.f_name && data?.f_name?.length > 255) {
      errors.f_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.m_name && data?.m_name?.length > 255) {
      errors.m_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.l_name && data?.l_name?.length > 255) {
      errors.l_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.url_name) {
      errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.url_name && data?.url_name?.length > 255) {
      errors.url_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    // else if (!validUrlsPattern.test(data?.url_name)) {
    //   errors.url_name = Messages.ERROR.INVALID_ACTION_LINK;
    // }
    if (!data?.status) {
      errors.status = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.phone_number && data?.phone_number?.length > 255) {
      errors.phone_number = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.email_address) {
      errors.email_address = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.studio_number && data?.studio_number?.length > 255) {
      errors.studio_number = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.other_service && data?.other_service?.length > 255) {
      errors.other_service = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    } else if (!removeSpecial.test(data?.other_service)) {
      errors.other_service = Messages.ERROR.REMOVE_SPECIAL_CHARACTER;
    }

    if (
      !data?.barber &&
      !data?.botox &&
      !data?.brows &&
      !data?.hair &&
      !data?.hair_extensions &&
      !data?.laser_hair_removal &&
      !data?.eyelash_extensions &&
      !data?.makeup &&
      !data?.massage &&
      !data?.microblading &&
      !data?.nails &&
      !data?.permanent_makeup &&
      !data?.skin &&
      !data?.tanning &&
      !data?.teeth_whitening &&
      !data?.threading &&
      !data?.waxing
    ) {
      errors.services = Messages.ERROR.SELECT_ATLEAST_ONE_SERVICE;
    }
    return errors;
  },
  validateSolaProfessionalsBillingForm: (data: any) => {
    const errors: any = {};
    if (!data?.billing_contact_info) {
      if (data?.billing_first_name && data?.billing_first_name?.length > 255) {
        errors.billing_first_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (data?.billing_middle_name && data?.billing_middle_name?.length > 255) {
        errors.billing_middle_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (data?.billing_last_name && data?.billing_last_name?.length > 255) {
        errors.billing_last_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (data?.billing_phone && data?.billing_phone?.length > 255) {
        errors.billing_phone = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (data?.billing_email && !emailRegex.test(data?.billing_email)) {
        errors.billing_email = Messages.ERROR.VALID_EMAIL;
      }
    }
    return errors;
  },
  validateAssociationWizard: (data: any) => {
    const errors: any = {};
    if (!data?.association_name) {
      errors.association_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.locations || (data?.locations && !data?.locations.length)) {
      errors.locations = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.owners || (data?.owners && !data?.owners.length)) {
      errors.owners = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateAssociationDetails: (data: any) => {
    const errors: any = {};
    if (!data?.association_name) {
      errors.association_name = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateMaintenanceContactForm: (data: any) => {
    const errors: any = {};
    if (!data?.location_id) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.contact_email) {
      errors.contact_email = Messages.ERROR.FIELD_REQUIRED;
    } else if (!emailRegex.test(data?.contact_email)) {
      errors.contact_email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.contact_first_name) {
      errors.contact_first_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.contact_phone_number) {
      errors.contact_phone_number = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },

  validateAddLocationWizard: (data: any) => {
    const errors: any = {};
    if (!data?.name) {
      errors.name = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.name && data?.name?.length > 255) {
      errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.msa?.name) {
      errors.msa = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.general_contact_first_name && data?.general_contact_first_name?.length > 255) {
      errors.general_contact_first_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.general_contact_last_name && data?.general_contact_last_name?.length > 255) {
      errors.general_contact_last_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.general_contact_email && !emailRegex.test(data?.general_contact_email)) {
      errors.general_contact_email = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.general_contact_phone && data?.general_contact_phone?.length > 255) {
      errors.general_contact_phone = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.email_address_for_inquiries && !emailRegex.test(data?.email_address_for_inquiries)) {
      errors.email_address_for_inquiries = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.email_address_for_reports && !emailRegex.test(data?.email_address_for_reports)) {
      errors.email_address_for_reports = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.email_address_for_hubspot && !emailRegex.test(data?.email_address_for_hubspot)) {
      errors.email_address_for_hubspot = Messages.ERROR.VALID_EMAIL;
    }
    if (
      data?.emails_for_stylist_website_approvals &&
      !emailRegex.test(data?.emails_for_stylist_website_approvals)
    ) {
      errors.emails_for_stylist_website_approvals = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.city && data?.city?.length > 255) {
      errors.city = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.state && data?.state?.length > 255) {
      errors.state = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.postal_code && data?.postal_code?.length > 255) {
      errors.postal_code = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    return errors;
  },
  validateApprovalForm: (data: any) => {
    const errors: any = {};
    if (data?.type === "legal" && !data?.sola_id) {
      errors.sola_id = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.type === "address") {
      if (!data?.approved_instagram_url) {
        errors.approved_instagram_url = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.approved_facebook_url) {
        errors.approved_facebook_url = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    return errors;
  },
  validateLocationTabs: (data: any, locationDetail: any, type?: string) => {
    const errors: any = {};
    if (type === "general") {
      if (!locationDetail?.name?.trim()) {
        errors.name = Messages.ERROR.FIELD_REQUIRED;
      } else if (locationDetail?.name && locationDetail?.name?.length > 255) {
        errors.name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (
        locationDetail?.general_contact_email &&
        !emailRegex.test(locationDetail?.general_contact_email)
      ) {
        errors.general_contact_email = Messages.ERROR.VALID_EMAIL;
      }

      if (
        locationDetail?.email_address_for_inquiries?.trim() &&
        !emailRegex.test(locationDetail?.email_address_for_inquiries)
      ) {
        errors.email_address_for_inquiries = Messages.ERROR.VALID_EMAIL;
      }
      if (
        locationDetail?.email_address_for_reports?.trim() &&
        !emailRegex.test(locationDetail?.email_address_for_reports)
      ) {
        errors.email_address_for_reports = Messages.ERROR.VALID_EMAIL;
      }
      if (
        locationDetail?.email_address_for_hubspot?.trim() &&
        !emailRegex.test(locationDetail?.email_address_for_hubspot)
      ) {
        errors.email_address_for_hubspot = Messages.ERROR.VALID_EMAIL;
      }
      if (
        locationDetail?.emails_for_stylist_website_approvals?.trim() &&
        !emailRegex.test(locationDetail?.emails_for_stylist_website_approvals)
      ) {
        errors.emails_for_stylist_website_approvals = Messages.ERROR.VALID_EMAIL;
      }
      if (!locationDetail?.msa?.name) {
        errors.msa = Messages.ERROR.FIELD_REQUIRED;
      }
    } else if (type === "website") {
      if (!locationDetail?.description || locationDetail?.description?.trim() === "<p><br></p>") {
        errors.description = Messages.ERROR.FIELD_REQUIRED;
      }
      if (locationDetail?.public_email && !emailRegex.test(locationDetail?.public_email)) {
        errors.public_email = Messages.ERROR.VALID_EMAIL;
      }
      if (locationDetail?.amenities?.length < 8) {
        errors.amenities = Messages.ERROR.SELECT_8_AMENITIES;
      }
    }

    return errors;
  },
  validateRmTab: (data: any) => {
    const errors: any = {};
    if (data?.from_email_address && !emailRegex.test(data?.from_email_address)) {
      errors.from_email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.to_email_address && !emailRegex.test(data?.to_email_address)) {
      errors.to_email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.professional_letter || data?.professional_letter === "<p><br></p>") {
      errors.professional_letter = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.renewal_letter || data?.renewal_letter === "<p><br></p>") {
      errors.renewal_letter = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.lease_agreement_letter || data?.lease_agreement_letter === "<p><br></p>") {
      errors.lease_agreement_letter = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.eft_letter) {
      errors.eft_letter = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.master_landlord) {
      errors.master_landlord = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.manager) {
      errors.manager = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.use_association_information) {
      if (!data?.business_name) {
        errors.business_name = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.incorporation_state) {
        errors.incorporation_state = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.notice_address) {
        errors.notice_address = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    // if (!data?.default_bank) {
    //   errors.default_bank = Messages.ERROR.FIELD_REQUIRED;
    // }
    if (!data?.rent_period) {
      errors.rent_period = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.rent_due_date) {
      errors.rent_due_date = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.lease_term) {
      errors.lease_term = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.security_deposit_amount) {
      errors.security_deposit_amount = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.insurance_term) {
      errors.insurance_term = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.insurance_fee) {
      errors.insurance_fee = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.annual_price_increase) {
      errors.annual_price_increase = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.weeks_free_rent) {
      errors.weeks_free_rent = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.months_free_insurence) {
      errors.months_free_insurence = Messages.ERROR.FIELD_REQUIRED;
    }

    if (data?.lease_term) {
      if (data?.weeks_free_rent && !errors?.weeks_free_rent) {
        if (data?.lease_term === "MTM") {
          if (Number(data?.weeks_free_rent) > 4) {
            errors.weeks_free_rent = `value should be less or equal to 4 weeks`;
          }
        } else if (data?.weeks_free_rent > Number(data?.lease_term) * 4) {
          errors.weeks_free_rent = `value should be less or equal to ${
            Number(data?.lease_term) * 4
          } weeks`;
        }
      }
      if (data?.months_free_insurence && !errors?.months_free_insurence) {
        if (data?.lease_term === "MTM") {
          if (Number(data?.months_free_insurence) > 1) {
            errors.months_free_insurence = `value should be less or equal to 1 month`;
          }
        } else if (data?.months_free_insurence > Number(data?.lease_term)) {
          errors.months_free_insurence = `value should be less or equal to ${Number(
            data?.lease_term
          )} months`;
        }
      }
    }
    return errors;
  },

  validateSendLeaseApplication: (data: any, isUpdate: boolean) => {
    const errors: any = {};
    /* if (!data?.title && !data?.first_name) {
      errors.title = Messages.ERROR.FIELD_REQUIRED;
    } */
    if (!data?.first_name) {
      errors.first_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.last_name) {
      errors.last_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.phone?.trim()) {
      errors.phone = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }

    if (isUpdate) {
      if (!data?.move_in_date) {
        errors.move_in_date = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.unit && !data?.lease_units) {
        errors.unit = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.rent_period) {
        errors.rent_period = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.rent_due_date) {
        errors.rent_due_date = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_term) {
        errors.lease_term = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.licence_fee_1 && !data?.license_fee_year1) {
        errors.licence_fee_1 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.licence_fee_2 && !data?.license_fee_year2) {
        errors.licence_fee_2 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.security_deposit_amount) {
        errors.security_deposit_amount = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_charge_frequency && !data?.insurance_change_frequency) {
        errors.insurance_charge_frequency = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_fee) {
        errors.insurance_fee = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.weeks_free_rent) {
        errors.weeks_free_rent = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.months_free_insurance) {
        errors.months_free_insurance = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_sign) {
        errors.lease_sign = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_start) {
        errors.lease_start = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.lease_end) {
        errors.lease_end = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.first_payment_date) {
        errors.first_payment_date = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data?.insurance_start) {
        errors.insurance_start = Messages.ERROR.FIELD_REQUIRED;
      }
      /* if (!data?.insurance_anniversary) {
        errors.insurance_anniversary = Messages.ERROR.FIELD_REQUIRED;
      } */
    }

    return errors;
  },
  validateSolaProWebsiteForm: (data: any) => {
    const errors: any = {};
    if (!data?.f_name) {
      errors.f_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.url_name) {
      errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.website_email_address && !emailRegex.test(data?.website_email_address)) {
      errors.website_email_address = Messages.ERROR.VALID_EMAIL;
    }
    ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"].map(
      (obj: any) => {
        if (data?.work_hours_data?.[obj]?.open) {
          if (
            data?.work_hours_data?.[obj]?.opens_at_1 &&
            !data?.work_hours_data?.[obj]?.closes_at_1
          ) {
            errors[`${obj}_closes_at_1`] = Messages.ERROR.CLOSES_AT_ERROR;
          }

          if (
            data?.work_hours_data?.[obj]?.opens_at_2 &&
            !data?.work_hours_data?.[obj]?.closes_at_2
          ) {
            errors[`${obj}_closes_at_2`] = Messages.ERROR.CLOSES_AT_ERROR;
          }

          if (
            data?.work_hours_data?.[obj]?.opens_at_1 &&
            data?.work_hours_data?.[obj]?.closes_at_1 &&
            !moment(data?.work_hours_data?.[obj]?.opens_at_1, "HH:mm a").isBefore(
              moment(data?.work_hours_data?.[obj]?.closes_at_1, "HH:mm a"),
              "minute"
            )
          ) {
            errors[`${obj}_closes_at_1`] = Messages.ERROR.CLOSES_AT_BEFORE_OPENS_AT;
          }

          if (
            data?.work_hours_data?.[obj]?.opens_at_2 &&
            data?.work_hours_data?.[obj]?.closes_at_2 &&
            !moment(data?.work_hours_data?.[obj]?.opens_at_2, "HH:mm a").isBefore(
              moment(data?.work_hours_data?.[obj]?.closes_at_2, "HH:mm a"),
              "minute"
            )
          ) {
            errors[`${obj}_closes_at_2`] = Messages.ERROR.CLOSES_AT_BEFORE_OPENS_AT;
          }

          if (
            data?.work_hours_data?.[obj]?.closes_at_1 &&
            data?.work_hours_data?.[obj]?.opens_at_2 &&
            !moment(data?.work_hours_data?.[obj]?.closes_at_1, "HH:mm a").isBefore(
              moment(data?.work_hours_data?.[obj]?.opens_at_2, "HH:mm a"),
              "minute"
            )
          ) {
            errors[`${obj}_opens_at_2`] = Messages.ERROR.SELECT_CORRECT_TIME_AFTER_CLOSES_AT;
          }
        }
        return true;
      }
    );
    for (let i = 1; i <= 10; i++) {
      if (
        data[`testimonial_${i}`] &&
        (data[`testimonial_${i}`]?.name ||
          data[`testimonial_${i}`]?.region ||
          data[`testimonial_${i}`]?.title) &&
        !data[`testimonial_${i}`]?.text
      ) {
        errors[`testimonial_${i}_text`] = Messages.ERROR.FIELD_REQUIRED;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.name &&
        data[`testimonial_${i}`]?.name?.length > 255
      ) {
        errors[`testimonial_${i}_name`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.region &&
        data[`testimonial_${i}`]?.region?.length > 255
      ) {
        errors[`testimonial_${i}_region`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.title &&
        data[`testimonial_${i}`]?.title?.length > 255
      ) {
        errors[`testimonial_${i}_title`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
    }
    return errors;
  },

  validateLocationUser: (data: any) => {
    const errors: any = {};
    if (!data?.user_id) {
      errors.user_id = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.user_access) {
      errors.user_access = Messages.ERROR.SELECT_ATLEAST_ONE_ACCESS;
    } else if (data?.user_access && !Object.keys(data?.user_access)?.length) {
      errors.user_access = Messages.ERROR.SELECT_ATLEAST_ONE_ACCESS;
    } else if (data?.user_access && Object.keys(data?.user_access).length) {
      const statusTrueArray: any = [];
      Object.keys(data?.user_access).map((obj: any) => {
        statusTrueArray.push(data?.user_access?.[obj]?.edit_access);
        statusTrueArray.push(data?.user_access?.[obj]?.view_access);
        statusTrueArray.push(data?.user_access?.[obj]?.add_access);
        statusTrueArray.push(data?.user_access?.[obj]?.none_access);
        return true;
      });
      if (!statusTrueArray.includes(true)) {
        errors.user_access = Messages.ERROR.SELECT_ATLEAST_ONE_ACCESS;
      }
    }
    return errors;
  },

  validateLocationUserUpdateForm: (data: any) => {
    const errors: any = {};
    if (!data?.user_id) {
      errors.user_id = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.user_access) {
      errors.user_access = Messages.ERROR.SELECT_ATLEAST_ONE_ACCESS;
    } else if (data?.user_access && !data?.user_access?.length) {
      errors.user_access = Messages.ERROR.SELECT_ATLEAST_ONE_ACCESS;
    } else if (data?.user_access && data?.user_access?.length) {
      const statusTrueArray: any = [];
      data?.user_access?.map((obj: any) => {
        statusTrueArray.push(obj?.edit_access);
        statusTrueArray.push(obj?.view_access);
        statusTrueArray.push(obj?.add_access);
        statusTrueArray.push(obj?.none_access);
        return true;
      });
      if (!statusTrueArray.includes(true)) {
        errors.user_access = Messages.ERROR.SELECT_ATLEAST_ONE_ACCESS;
      }
    }
    return errors;
  },
  validateSMSTemplate: (data: any) => {
    const errors: any = {};
    if (!data?.templateName) {
      errors.templateName = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.templateContent) {
      errors.templateContent = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },

  validateSMSContentToken: (token: any) => {
    const errors: any = {};
    if (!token) {
      errors.token = Messages.ERROR.FIELD_REQUIRED;
    }
  },

  validateWaitlistPopup: (data: any) => {
    const errors: any = {};
    if (!data?.waitlistDate) {
      errors.waitlistDate = Messages.ERROR.FIELD_REQUIRED;
    }

    return errors;
  },
  validateMarkClosedPopup: (data: any) => {
    const errors: any = {};
    if (!data?.reasonClosingLead) {
      errors.reasonClosingLead = Messages.ERROR.FIELD_REQUIRED;
    }

    return errors;
  },
  validateUpdatePhoneNumber: (data: any) => {
    const errors: any = {};
    if (!data?.number_name) {
      errors.number_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.call_tree_status) {
      if (!data.use_pre_recorded_instructions) {
        if (!data?.forwarding_no_1) {
          errors.forwarding_no_1 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.preRecordedVoice1 && !data?.pre_recorded_instruction) {
        errors.pre_recorded_instruction = Messages.ERROR.FIELD_REQUIRED;
      }

      if (!data.use_pre_recorded_instructions_2) {
        if (!data?.forwarding_no_2) {
          errors.forwarding_no_2 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.pre_recorded_instruction_2) {
        errors.pre_recorded_instruction_2 = Messages.ERROR.FIELD_REQUIRED;
      }

      if (!data.use_pre_recorded_instructions_3) {
        if (!data?.forwarding_no_3) {
          errors.forwarding_no_3 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.pre_recorded_instruction_3) {
        errors.pre_recorded_instruction_3 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data.use_pre_recorded_instructions_4) {
        if (!data?.forwarding_no_4) {
          errors.forwarding_no_4 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.pre_recorded_instruction_4) {
        errors.pre_recorded_instruction_4 = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (
      !data?.call_tree_status &&
      data?.forwarding_number &&
      validatePhoneNumber(data?.forwarding_number || "").length !== 11 &&
      validatePhoneNumber(data?.forwarding_number || "") !== "1"
    ) {
      errors.forwarding_number = Messages.ERROR.ADD_PHONE;
    }
    if (
      data?.sms_forwarding_number &&
      validatePhoneNumber(data?.sms_forwarding_number || "").length !== 11 &&
      validatePhoneNumber(data?.sms_forwarding_number || "") !== "1"
    ) {
      errors.sms_forwarding_number = Messages.ERROR.ADD_PHONE;
    }
    return errors;
  },

  validateUpdateRMPhoneNumber: (data: any) => {
    const errors: any = {};
    if (!data?.number_name) {
      errors.number_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.call_tree_status) {
      if (!data.use_pre_recorded_instructions) {
        if (!data?.forwarding_no_1) {
          errors.forwarding_no_1 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.pre_recorded_instruction) {
        errors.pre_recorded_instruction = Messages.ERROR.FIELD_REQUIRED;
      }

      if (!data.use_pre_recorded_instructions_2) {
        if (!data?.forwarding_no_2) {
          errors.forwarding_no_2 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.pre_recorded_instruction_2) {
        errors.pre_recorded_instruction_2 = Messages.ERROR.FIELD_REQUIRED;
      }

      if (!data.use_pre_recorded_instructions_3) {
        if (!data?.forwarding_no_3) {
          errors.forwarding_no_3 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.pre_recorded_instruction_3) {
        errors.pre_recorded_instruction_3 = Messages.ERROR.FIELD_REQUIRED;
      }
      if (!data.use_pre_recorded_instructions_4) {
        if (!data?.forwarding_no_4) {
          errors.forwarding_no_4 = Messages.ERROR.FIELD_REQUIRED;
        }
      } else if (!data?.pre_recorded_instruction_4) {
        errors.pre_recorded_instruction_4 = Messages.ERROR.FIELD_REQUIRED;
      }
    }
    if (
      data?.forwarding_phone_number &&
      validatePhoneNumber(data?.forwarding_phone_number || "").length !== 11 &&
      validatePhoneNumber(data?.forwarding_phone_number || "") !== "1"
    ) {
      errors.forwarding_phone_number = Messages.ERROR.ADD_PHONE;
    }
    return errors;
  },

  validateLeadInfoForm: (data: any) => {
    const errors: any = {};
    if (!data?.email) {
      errors.email = Messages.ERROR.ADD_EMAIL;
    } else if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }

    return errors;
  },
  // Check Lead is selected or not
  validateLeads: (data: any) => {
    const errors: any = {};
    if (!data?.leads || data?.leads?.length === 0) {
      errors.leads = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  // Check Stylits is selected or not
  validateStylists: (data: any) => {
    const errors: any = {};
    if (!data?.stylists || data?.stylists?.length === 0) {
      errors.stylists = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  newDataCheckDeals: (data: any) => {
    const errors: any = {};
    if (!data?.firstname) {
      errors.firstname = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.firstname && (data?.firstname?.length < 1 || data?.firstname?.length > 255)) {
      errors.firstname = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR_LEADS;
    }
    if (!data?.lastname) {
      errors.lastname = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.lastname && (data?.lastname?.length < 1 || data?.lastname?.length > 255)) {
      errors.lastname = Messages.GENERAL.COMMON_STRING_LENGTH_ERROR_LEADS;
    }
    if (!data?.email) {
      errors.email = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.email && !emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.phone) {
      errors.phone = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.location?.name) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.services || data?.services?.length <= 0) {
      errors.services = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  applicantsData: (data: any) => {
    const errors: any = {};
    [...Array(Number(data?.numFields))].map((obj: any, index: any) => {
      if (!data?.[index]?.first_name) {
        errors[`applicant_${index + 1}_first_name`] = Messages.ERROR.FIELD_REQUIRED;
      } else if (
        data?.[index]?.first_name &&
        (data?.[index]?.first_name?.length < 1 || data?.[index]?.first_name?.length > 255)
      ) {
        errors[`applicant_${index + 1}_first_name`] =
          Messages.GENERAL.COMMON_STRING_LENGTH_ERROR_LEADS;
      }
      if (!data?.[index]?.last_name) {
        errors[`applicant_${index + 1}_last_name`] = Messages.ERROR.FIELD_REQUIRED;
      } else if (
        data?.[index]?.last_name &&
        (data?.[index]?.last_name?.length < 1 || data?.[index]?.last_name?.length > 255)
      ) {
        errors[`applicant_${index + 1}_last_name`] =
          Messages.GENERAL.COMMON_STRING_LENGTH_ERROR_LEADS;
      }
      if (!data?.[index]?.email) {
        errors[`applicant_${index + 1}_email`] = Messages.ERROR.FIELD_REQUIRED;
      } else if (data?.[index]?.email && !emailRegex.test(data?.[index]?.email)) {
        errors[`applicant_${index + 1}_email`] = Messages.ERROR.VALID_EMAIL;
      }
      if (!data?.[index]?.phone) {
        errors[`applicant_${index + 1}_phone`] = Messages.ERROR.FIELD_REQUIRED;
      }
      return true;
    });
    return errors;
  },
  validateWebPageForm: (data: any) => {
    const errors: any = {};
    // if (!data?.url) {
    //   errors.url = Messages.ERROR.FIELD_REQUIRED;
    // }
    if (data?.website_url && data?.website_url?.length > 255) {
      errors.website_url = Messages.ERROR.INVALID_ACTION_LINK;
    } else if (data?.website_url && !isURL(data?.website_url)) {
      errors.website_url = Messages.ERROR.INVALID_WEBSITE_LINK;
    }
    if (data?.booking_url && data?.booking_url?.length > 255) {
      errors.booking_url = Messages.ERROR.INVALID_ACTION_LINK;
    } else if (data?.booking_url && !isURL(data?.booking_url)) {
      errors.booking_url = Messages.ERROR.INVALID_BOOKING_LINK;
    }
    if (!data?.business_name) {
      errors.business_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.url_name) {
      errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.business_name && data?.business_name?.length > 255) {
      errors.business_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.studio_number && data?.studio_number?.length > 255) {
      errors.studio_number = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.url_name && data?.url_name?.length > 255) {
      errors.url_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.connect_users?.length) {
      errors.connect_users = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.location?.length) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.website_email && !emailRegex.test(data?.website_email)) {
      errors.website_email = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.website_email && data?.website_email?.length > 255) {
      errors.website_email = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (
      data?.website_phone &&
      validatePhoneNumber(data?.website_phone || "").length !== 11 &&
      validatePhoneNumber(data?.website_phone || "") !== "1"
    ) {
      errors.website_phone = Messages.ERROR.ADD_PHONE;
    }

    if (data?.facebook_url && data?.facebook_url?.length > 255) {
      errors.facebook_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.google_plus_url && data?.google_plus_url?.length > 255) {
      errors.google_plus_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.instagram_url && data?.instagram_url?.length > 255) {
      errors.instagram_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.linkedin_url && data?.linkedin_url?.length > 255) {
      errors.linkedin_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.pinterest_url && data?.pinterest_url?.length > 255) {
      errors.pinterest_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.twitter_url && data?.twitter_url?.length > 255) {
      errors.twitter_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.yelp_url && data?.yelp_url?.length > 255) {
      errors.yelp_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    if (data?.tik_tok_url && data?.tik_tok_url?.length > 255) {
      errors.tik_tok_url = Messages.ERROR.INVALID_ACTION_LINK;
    }
    for (let i = 1; i <= 10; i++) {
      if (
        data[`testimonial_${i}`] &&
        (data[`testimonial_${i}`]?.name || data[`testimonial_${i}`].region) &&
        !data[`testimonial_${i}`]?.text
      ) {
        errors[`testimonial_${i}_text`] = Messages.ERROR.FIELD_REQUIRED;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.name &&
        data[`testimonial_${i}`]?.name?.length > 255
      ) {
        errors[`testimonial_${i}_name`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.region &&
        data[`testimonial_${i}`]?.region?.length > 255
      ) {
        errors[`testimonial_${i}_region`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
      if (
        data[`testimonial_${i}`] &&
        data[`testimonial_${i}`]?.title &&
        data[`testimonial_${i}`]?.title?.length > 255
      ) {
        errors[`testimonial_${i}_title`] = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
      }
    }
    return errors;
  },
  validateNewSolaProForm: (data: any) => {
    const errors: any = {};
    if (!data?.f_name) {
      errors.f_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data?.f_name && data?.f_name?.length > 255) {
      errors.f_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.m_name && data?.m_name?.length > 255) {
      errors.m_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.l_name && data?.l_name?.length > 255) {
      errors.l_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    // if (!data?.url_name) {
    //   errors.url_name = Messages.ERROR.FIELD_REQUIRED;
    // }
    // if (data?.url_name && data?.url_name?.length > 255) {
    //   errors.url_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    // }
    if (data?.phone_number && data?.phone_number?.length > 255) {
      errors.phone_number = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (!data?.email_address?.trim()) {
      errors.email_address = Messages.ERROR.FIELD_REQUIRED;
    } else if (!emailRegex.test(data?.email_address)) {
      errors.email_address = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    // if (!data?.services?.length) {
    //   errors.services = Messages.ERROR.SELECT_ATLEAST_ONE_SERVICE;
    // }
    if (data?.billing_first_name && data?.billing_first_name?.length > 255) {
      errors.billing_first_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.billing_last_name && data?.billing_last_name?.length > 255) {
      errors.billing_last_name = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    }
    if (data?.billing_email && !emailRegex.test(data?.billing_email)) {
      errors.billing_email = Messages.ERROR.VALID_EMAIL;
    }
    if (data?.other_service && data?.other_service?.length > 255) {
      errors.other_service = Messages.ERROR.FIELD_STRING_LENGTH_ERROR;
    } else if (!removeSpecial.test(data?.other_service)) {
      errors.other_service = Messages.ERROR.REMOVE_SPECIAL_CHARACTER;
    }
    // if (!data?.status) {
    //   errors.status = Messages.ERROR.FIELD_REQUIRED;
    // }
    return errors;
  },
  validateRMContactForm: (data: any) => {
    const errors: any = {};
    if (!data?.f_name) {
      errors.f_name = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.email) {
      errors.email = Messages.ERROR.FIELD_REQUIRED;
    } else if (!emailRegex.test(data?.email)) {
      errors.email = Messages.ERROR.VALID_EMAIL;
    }
    if (!data?.phone) {
      errors.phone = Messages.ERROR.FIELD_REQUIRED;
    } else if (!/^\d{10}$/.test(data?.phone)) {
      errors.phone = Messages.ERROR.ONLY_10_DIGIT_PHONE;
    }
    if (!data?.selectedLocations || !data?.selectedLocations?.length) {
      errors.selectedLocations = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateWeekend: (data: any) => {
    const errors: any = {};
    if (!data?.weekendTimezone) {
      errors.weekend_timezone = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data.weekend && !data?.tillDate) {
      errors.weekend_tilldate = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data.weekend && (!data?.weekendMessage || !data?.weekendMessage.trim())) {
      errors.weekend_message = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data.outOfOffice && !data?.outOfficeOwnerId) {
      errors.secondary_owner = Messages.ERROR.SECONDARY_OWNER;
    }
    if (data.outOfOffice && !data?.outOfficeStartdate) {
      errors.start_date = Messages.ERROR.FIELD_REQUIRED;
    }
    if (data.outOfOffice && data?.outOfficeStartdate) {
      const isAfter = moment(data?.outOfficeStartdate).isAfter(
        moment().utc().toISOString(),
        "minutes"
      );
      if (!isAfter) {
        errors.start_date = Messages.ERROR.INVALID_STARTDATE;
      }
    }
    if (data.outOfOffice && data?.outOfficeStartdate && data?.outOfficeEnddate) {
      const isAfter = moment(data?.outOfficeEnddate).isAfter(data?.outOfficeStartdate, "minutes");
      if (!isAfter) {
        errors.end_date = Messages.ERROR.INVALID_DATE;
      }
    }
    return errors;
  },
  validateTicketForm: (data: any, isEdit: any, addedFromTicket: any) => {
    const errors: any = {};
    if (!isEdit) {
      if (!data?.contacts && !data?.users && addedFromTicket === "manually") {
        errors.contacts = Messages.ERROR.SELECT_ONE;
        errors.users = Messages.ERROR.SELECT_ONE;
      }
    }
    // if (data?.status === "Scheduled" && !data?.schedule_date) {
    //   errors.schedule_date = Messages.ERROR.FIELD_REQUIRED;
    // }
    // if (data?.status === "Assigned" && !data?.assigned_user_id) {
    //   errors.user = Messages.ERROR.FIELD_REQUIRED;
    // }
    if (!data?.subject) {
      errors.subject = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.subject && data?.subject?.length > 90) {
      errors.subject = Messages.ERROR.TICKET_SUBJECT;
    }
    if (!data?.description) {
      errors.description = Messages.ERROR.FIELD_REQUIRED;
    } else if (data?.description && data?.description?.length > 1500) {
      errors.description = Messages.ERROR.TICKET_DESCRIPTION;
    }
    if (!data?.location) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.connect_rm_categories) {
      errors.connect_rm_categories = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.studios?.length) {
      errors.studios = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.due_date && addedFromTicket === "manually") {
      errors.due_date = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
  validateDealImportForm: (data: any) => {
    const errors: any = {};
    if (!data?.location?.name) {
      errors.location = Messages.ERROR.FIELD_REQUIRED;
    }
    if (!data?.file) {
      errors.file = Messages.ERROR.FIELD_REQUIRED;
    }
    return errors;
  },
};

export default Validations;
