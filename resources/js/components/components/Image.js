import { useState } from "react";
import { DEF_IMAGE } from "../config";

export default function Image(props) {
    const [isLoading, setIsLoading] = useState(true);
    const onLoad = () => {
        setIsLoading(false)
        props.onLoad?.();
    }
    return (
        <>
            <img
                {...props}
                src={props.def || DEF_IMAGE.coin}
                style={{ display: !isLoading && "none" }}
            />
            <img
                {...props}
                style={{ display: isLoading && "none" }}
                onLoad={onLoad}
            />
        </>
    )
}