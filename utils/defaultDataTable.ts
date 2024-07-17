
import { OptionType } from "react-datatable-responsive"

const defaultDataTableOptions = (darkMode: "dark" | "light"): OptionType => {

  return {
    color: {
      color: darkMode === "dark" ? "#fff" : "#121212",
      backgroundColor: darkMode === "dark" ? "#121212" : "#fff",
      borderColor: "#e5e7eb"
    },
    download: true,
    filter: true,
    print: true,
    search: true,
    viewColumns: true,
    pagination: true,
    resizableColumns: true,
    responsive: true,
    rowsPerPage: 10,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    searchPlaceholder: "",
    selectableRowsHideCheckboxes: true,
    cells: {
      imageWidth: 60,
    },
    textLabels: {
      body: {
        title: "",
        noMatch: "...", //"داده ای جهت نمایش وجود ندارد",
        toolTip: "مرتب سازی",
      },
      pagination: {
        first: "اولین صفحه",
        last: "آخرین صفحه",
        next: "صفحه بعدی",
        previous: "صفحه قبلی",
        rowsPerPage: "تعداد ردیفها در صفحه",
      },
      menu: {
        search: "جستجو",
        downloadExcel: "فایل اکسل",
        print: "چاپ",
        viewColumns: "مشاهده ستون ها",
        filterTable: "فیلتر",
      },
      filter: {
        title: "فیلتر جدول",
        add: "اضافه کردن فیلتر",
        delete: "حذف فیلتر",
      },
      viewColumns: {
        title: "مشاهده ستون ها",
        titleItem: "نمایش/عدم نمایش",
      },
      selectedRows: {
        text: "سطر(ها) انتخاب شده",
        delete: "حذف سطر(ها) انتخاب شده",
      },
    }
  }
}


export default defaultDataTableOptions
