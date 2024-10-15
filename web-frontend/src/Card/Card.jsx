import styles from "./Card.module.css";

const Card = ({ children, style }) => {
    return (
        <div style={style} className={styles.container}>
            {children}
        </div>
    );
};

export default Card;
