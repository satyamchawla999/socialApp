import { format } from "date-fns";
import { setUser, setUserData } from "../Features/Social/userSlice";
import { signInWithGoogle } from "../Firebase/auth";



// FOR COVERTING AND RETURNING DAY/DATE ACCORDING TO TIMESTAMP
// "format" is used for returning date in particular format

export const getDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const currentdate = new Date();

    let day = date.getDay();
    let currentDay = currentdate.getDay();

    const diff = currentDay - day;
    if (diff === 0)
        return 'Today';
    else if (day === 1)
        return 'Tomorrow';
    else
        return format(date, "dd/MM/yyyy");
}

// FOR IMPLEMENTING "New Post" LOGIC ON UPPER-RIGHT CORNER OF NEW POST
// FUNCTION RETURN TRUE IF THE TIME DIFFRENCE OF POST IS 5 MINUITS

export const isTimeDifferenceFiveMinutes = (post) => {
    const date = post?.date?.seconds ? new Date(post.date.seconds * 1000) : null;
    const formattedTime = date ? date.toLocaleTimeString() : null;

    if (formattedTime) {
        const currentTime = new Date();
        const timeDifference = Math.abs(currentTime.getTime() - date.getTime());
        const minutesDifference = Math.floor(timeDifference / (1000 * 60));
        return minutesDifference <= 5;
    }

    return false;
}


// COMMON FUNCTION FOR SIGNIN AND SIGNUP WITH AUTHBUTTON
export const authButton = async (dispatch,Navigate) => {
    try {
        const data = await signInWithGoogle();
        dispatch(setUser());
        dispatch(setUserData(data));
        Navigate("/home");
    } catch (err) {
        alert(err);
        console.error(err);
    }
}
