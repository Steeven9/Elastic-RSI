import { useSelector } from 'react-redux';
import GetData from './charts/GetData';

const ChartTabs = () => {
    const tab = useSelector((st) => st.generalReducer.tab);

    const renderTabs = () => {
        switch(tab) {
            case 'home':
                return <GetData />;
            default:
                return <GetData />;
        }
    }

    return (
        <>
            {renderTabs()}
        </>
    )
}

export default ChartTabs;