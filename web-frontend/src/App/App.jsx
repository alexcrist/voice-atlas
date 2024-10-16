import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    getCountryAtPoint,
    getStateAtPoint,
} from "../geographicBorders/getCountryAtPoint";
import InfoCard from "../InfoCard/InfoCard";
import mainSlice from "../mainSlice";
import { useAddMapClickListener, useInitMap } from "../map/map";
import { useFlyToEntity } from "../map/useFlyToEntity";
import {
    useRenderFocusedCountry,
    useRenderFocusedState,
} from "../map/useRenderFocusedCountryAndState";
import { useShowHoveredEntity } from "../map/useShowHoveredEntity";
import styles from "./App.module.css";

const App = () => {
    const dispatch = useDispatch();

    // Initialize the map
    const initMap = useInitMap();
    useEffect(() => initMap(), [initMap]);

    // On map click, set focused country
    const flyToEntity = useFlyToEntity();
    const addMapClickListener = useAddMapClickListener();
    const focusedCountry = useSelector((state) => state.main.focusedCountry);
    useEffect(() => {
        return addMapClickListener(async (event) => {
            const lon = event.lngLat.lng;
            const lat = event.lngLat.lat;
            const country = await getCountryAtPoint(lon, lat);
            let state = null;
            if (
                country &&
                focusedCountry &&
                country.name === focusedCountry.name &&
                focusedCountry.statesData
            ) {
                state = await getStateAtPoint(
                    lon,
                    lat,
                    focusedCountry.statesData,
                );
            }
            dispatch(mainSlice.actions.setFocusedCountry(country));
            dispatch(mainSlice.actions.setFocusedState(state));
            if (state) {
                flyToEntity(state);
            } else if (country) {
                flyToEntity(country);
            }
        });
    }, [addMapClickListener, dispatch, flyToEntity, focusedCountry]);

    // On map hover, show info pop-up
    const hoveredEntity = useShowHoveredEntity();

    // Render the focused country
    const renderFocusedCountry = useRenderFocusedCountry();
    useEffect(() => renderFocusedCountry(), [renderFocusedCountry]);

    // Render the focused state
    const renderFocusedState = useRenderFocusedState();
    useEffect(() => renderFocusedState(), [renderFocusedState]);

    return (
        <div className={styles.container}>
            <div className={styles.map} id="map"></div>
            {hoveredEntity}
            <InfoCard />
        </div>
    );
};

export default App;
