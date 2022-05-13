package uk.recurse.geocoding.reverse;

import java.io.BufferedReader;
import java.io.Reader;
import java.util.Map;

import static java.util.stream.Collectors.toMap;

public class Timezone {
    private final String countryCode;
    private final String timezoneId;
    private final float gmtOffset;

    private Timezone(String[] row) {
        countryCode = row[0];
        timezoneId = row[1];
        gmtOffset = Float.parseFloat(row[2]);
    }

    public String countryCode() {
        return countryCode;
    }

    public String timezoneId() {
        return timezoneId;
    }

    public float gmtOffset() {
        return gmtOffset;
    }

    static Map<String, Timezone> load(Reader reader) {
        return new BufferedReader(reader).lines()
                .skip(1)
                .filter(line -> !line.startsWith("#"))
                .map(line -> line.split("\t"))
                .collect(toMap(row -> row[0], Timezone::new, (a, b) -> a));
    }
}
