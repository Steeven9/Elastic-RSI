package uk.recurse.geocoding.reverse;

import com.fasterxml.jackson.annotation.JacksonInject;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;
import java.util.stream.Stream;

@JsonIgnoreProperties(ignoreUnknown = true)
class Feature {

    private final Country country;
    private final Admin1 admin1;
    private final Geometry geometry;

    @JsonCreator
    Feature(
            @JacksonInject("countries") Map<String, Country> countries,
            @JsonProperty("properties") Map<String, String> properties,
            @JsonProperty("geometry") Geometry geometry
    ) {
        String iso3 = properties.get("ISO3166-1-Alpha-3");
        country = countries.get(iso3);
        if (country == null) {
            throw new IllegalArgumentException("Missing country " +
                    properties.get("country") +
                    '(' + iso3 + ')');
        }
        admin1 = new Admin1(country.iso(), properties.get("name"));
        this.geometry = geometry;
    }

    Country country() {
        return country;
    }

    Admin1 admin1() {
        return admin1;
    }

    Stream<Geometry> geometries() {
        return geometry.flatten(country, admin1);
    }
}
