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
    private final Geometry geometry;
    private final Timezone timezone;

    @JsonCreator
    Feature(
            @JacksonInject Map<String, Country> countries,
            @JacksonInject Map<String, Timezone> timezones,
            @JsonProperty("properties") Map<String, String> properties,
            @JsonProperty("geometry") Geometry geometry
    ) {
        String id = properties.get("geoNameId");
        country = countries.get(id);
        timezone = timezones.get(country.iso());
        this.geometry = geometry;
    }

    Country country() {
        return country;
    }

    Timezone timezone() {
        return timezone;
    }

    Stream<Geometry> geometries() {
        return geometry.flatten(country);
    }
}
