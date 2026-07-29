import moment from "moment";

export default function messageFormat (username, text) {

    return {
        username,
        text,
        time: moment().format('h:mm a')
    }
}