import moment from "moment";

const dateFormatter = {
    monthDayYear (date) {
        return moment(date).format('ll');
    }
}

export default dateFormatter;
