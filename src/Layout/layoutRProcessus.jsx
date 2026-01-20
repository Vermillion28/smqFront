import { useRouter } from "next/router";
// import { Toaster } from "../components/ui/toaster";
import RPsidebar from "@/components/RPsidebar";
import styles from "@/styles/Layout.module.css";

const LayoutRProcessus = ({ children }) => {
    const router = useRouter();

    const handleNavigation = (route) => {
        router.push(route);
    };

    return(
        <div className={styles.layout}>
            <RPsidebar />
            <div className={styles.layoutContent}>
                {children}
            </div>
        </div>
    )
}
export default LayoutRProcessus;