package uk.recurse.geocoding.reverse;

import java.util.Objects;

public class Admin1 {

    public final String countryIso;
    private final String name;

    public Admin1(String countryIso, String name) {
        this.countryIso = countryIso;
        this.name = name;
    }

    public String name() {
        return name;
    }

    public String countryIso() {
        return countryIso;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        } else if (o == null || getClass() != o.getClass()) {
            return false;
        } else {
            final Admin1 other = (Admin1) o;
            return Objects.equals(name, other.name) &&
                    Objects.equals(countryIso, other.countryIso);
        }
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, countryIso);
    }

    @Override
    public String toString() {
        return countryIso + "/" + name;
    }
}
