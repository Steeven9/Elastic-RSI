package uk.recurse.geocoding.reverse;

import com.fasterxml.jackson.databind.InjectableValues;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UncheckedIOException;
import java.sql.Time;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;

import static java.nio.charset.StandardCharsets.UTF_8;

/**
 * A reverse geocoder that converts latitude and longitude coordinates to a country.
 */
public class ReverseGeocoder {

    private final FeatureCollection featureCollection;
    private final Map<String, Timezone> timezones;

    /**
     * Creates a new reverse geocoder. This is an expensive operation as the country boundary data
     * is parsed each time the class constructed.
     */
    public ReverseGeocoder() {
        Class<?> cls = ReverseGeocoder.class;
        try (
                InputStream countryInfo = cls.getResourceAsStream("/countryInfo.txt");
                InputStream timezonesInfo = cls.getResourceAsStream("/timezones.txt");
                InputStream shapes = cls.getResourceAsStream("/admin1.geojson")
        ) {
            featureCollection = load(countryInfo, shapes);
            assert timezonesInfo != null;
            timezones = Timezone.load(new InputStreamReader(timezonesInfo, UTF_8));
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }

    private FeatureCollection load(InputStream countryInfo, InputStream shapes) throws IOException {
        Map<String, Country> countriesMap = Country.load(new InputStreamReader(countryInfo, UTF_8));
        InjectableValues countriesInjectables = new InjectableValues.Std().addValue("countries", countriesMap);
        return new ObjectMapper()
                .readerFor(FeatureCollection.class)
                .with(countriesInjectables)
                .readValue(shapes);
    }

    /**
     * Converts a coordinate into a country.
     *
     * @param lat degrees latitude
     * @param lon degrees longitude
     * @return the country at the given coordinate
     */
    public Optional<Country> getCountry(double lat, double lon) {
        return getCountry((float) lat, (float) lon);
    }

    /**
     * Converts a coordinate into a country.
     *
     * @param lat degrees latitude
     * @param lon degrees longitude
     * @return the country at the given coordinate
     */
    public Optional<Country> getCountry(float lat, float lon) {
        return Optional.ofNullable(featureCollection.getCountry(lat, lon));
    }

    /**
     * Get the timezone for a given country.
     */
    public Optional<Timezone> getTimezone(Country country) {
        return Optional.ofNullable(timezones.get(country.iso()));
    }

    /**
     * Converts a coordinate into an admin1.
     *
     * @param lat degrees latitude
     * @param lon degrees longitude
     * @return the admin1 at the given coordinate
     */
    public Optional<Admin1> getAdmin1(float lat, float lon) {
        return Optional.ofNullable(featureCollection.getAdmin1(lat, lon));
    }

    /**
     * Returns all the countries recognised by the reverse geocoder.
     *
     * @return stream of countries
     */
    public Stream<Country> countries() {
        return featureCollection.countries();
    }

}
