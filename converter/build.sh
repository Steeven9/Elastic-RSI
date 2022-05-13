#!/usr/bin/env bash
#
# Usage
#
#   tools/build.sh [/path/to/out-file]
#
# Then run [/path/to/out-file] to run the java file as stand-alone executable.
# Note that the "java" command must be in $PATH in order for the executable to work.
#

output="$1"
if [ -z "${output}" ]; then
  echo "Specify an output file"
  exit 1
fi

./gradlew :shadowJar

out_jar="build/libs/converter-1.0-all.jar"
if [ -f "${out_jar}" ]; then
#  if [ -f "${output}" ]; then
#    rm -f "${output}"
#  fi
#
  {
    printf "#!/usr/bin/env sh\n"
    printf "test \$(command -v java)"
    printf " && exec java -jar \"\$0\" \"\$@\""
    printf " || echo \"Could not find java in \\\$PATH\" && exit 1\n"
    cat "${out_jar}"
  } > "${output}"
  chmod a+x "${output}"
fi

#java -cp "${out_jar}" picocli.AutoComplete ch.usi.inf.va2022.elasticrsi.Main \
#  -n "$(basename "${output}")" \
#  -f \
#  -o "${output}_completion"
