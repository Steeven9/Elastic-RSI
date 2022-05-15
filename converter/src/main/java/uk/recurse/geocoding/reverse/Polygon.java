package uk.recurse.geocoding.reverse;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.stream.Stream;

@JsonIgnoreProperties(ignoreUnknown = true)
class Polygon implements Geometry {

    private final Ring ring;
    private final Geometry holes;
    private final Country country;

    private final Admin1 admin1;

    @JsonCreator
    Polygon(@JsonProperty("coordinates") Ring[] rings) {
        this(rings[0], SortTileRecursive.pack(Stream.of(rings).skip(1)), null, null);
    }

    private Polygon(Ring ring, Geometry holes, Country country, Admin1 admin1) {
        this.ring = ring;
        this.holes = holes;
        this.country = country;
        this.admin1 = admin1;
    }

    @Override
    public boolean contains(float lat, float lon) {
        return ring.contains(lat, lon) && !holes.contains(lat, lon);
    }

    @Override
    public Country getCountry(float lat, float lon) {
        return contains(lat, lon) ? country : null;
    }


    @Override
    public Admin1 getAdmin1(float lat, float lon) {
        return contains(lat, lon) ? admin1 : null;
    }

    @Override
    public BoundingBox boundingBox() {
        return ring.boundingBox();
    }

    @Override
    public Stream<Geometry> flatten(Country country, Admin1 admin1) {
        return Stream.of(new Polygon(ring, holes, country, admin1));
    }
}
