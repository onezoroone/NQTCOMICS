import styles from "./readcomic.module.css";
function Loading() {
    return (  
        <div className="w-screen h-screen flex items-center justify-center">
            <div className={styles.loader}></div>
        </div>
    );
}

export default Loading;