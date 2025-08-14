#include <iostream>
#include <string>
#include <cstdio>

const std::string opacity = "0.6";
const double tints_shades_index = 1;

int value(char c) {
    if (c>=0 && c<='9') return c-(int)('0');
    else if (c>='A' && c<='F') return c-(int)('A')+10;
    else if (c>='a' && c<='f') return c-(int)('a')+10;
    return -1;
}

int tints_shades(int n) {
    if (n*tints_shades_index > 255) return 255;
    return n * tints_shades_index;
}

std::string hex_to_dec(std::string s) {
    std::string output = std::to_string(tints_shades(value(s[0])*16+value(s[1])));
    return output;
}

std::string hex_to_rgba(std::string s) {
    std::string output = "rgba(";
    std::string a = "", b = "", c = "";
    a += s[0]; a += s[1];
    b += s[2]; b += s[3];
    c += s[4]; c += s[5];
    output += hex_to_dec(a) + ", " + hex_to_dec(b) + ", " + hex_to_dec(c) + ", " + opacity + ");";

    return output;
}

int main(int argc, const char* argv[]) {
    std::freopen("template-colors", "r", stdin);
    std::freopen("rgb-colors.css", "w", stdout);
    std::string s;

    for (int i = 0; i < 16; i++) {
        std::getline(std::cin, s);
        std::cout << "@define-color color" << i << "-rgba " << hex_to_rgba(s) << '\n';
    }

    return 0;
}
