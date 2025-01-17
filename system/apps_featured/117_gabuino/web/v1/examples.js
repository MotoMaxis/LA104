examples = 
{
  'aalines.cpp': '#include <library.h>\n' +
    '\n' +
    'using namespace BIOS;\n' +
    '\n' +
    'typedef int fix16_t;\n' +
    'void drawline_aa(fix16_t fx1, fix16_t fy1, fix16_t fx2, fix16_t fy2, int color);\n' +
    '\n' +
    'int main(void)\n' +
    '{\n' +
    '    int x = 0, y = 0;\n' +
    '    BIOS::KEY::EKey key;\n' +
    '    while ((key = KEY::GetKey()) != BIOS::KEY::EKey::Escape)\n' +
    '    {\n' +
    '        int x1 = rand() % BIOS::LCD::Width;\n' +
    '        int y1 = rand() % BIOS::LCD::Height;\n' +
    '        int c = rand() & 0xffff;\n' +
    '        drawline_aa(x*256, y*256, x1*256, y1*256, c);\n' +
    '        x = x1;\n' +
    '        y = y1;\n' +
    '    }\n' +
    '    \n' +
    '    return 0;\n' +
    '}\n' +
    '\n' +
    '\n' +
    '// https://github.com/PetteriAimonen/QuadPawn/blob/master/Runtime/drawing.c\n' +
    '\n' +
    '/* Antialiased line drawing */\n' +
    '\n' +
    '// Alpha-blend two colors together. Alpha is 0 to 255.\n' +
    '// The ratios have been biased a bit to make the result look\n' +
    '// better on a cheap TFT.\n' +
    'int blend(int fg, int bg, int alpha)\n' +
    '{\n' +
    '    int fg_per_2 = (fg & 0xF7DE) >> 1;\n' +
    '    int fg_per_4 = (fg & 0xE79C) >> 2;\n' +
    '    int fg_per_8 = (fg & 0xC718) >> 3;\n' +
    '    \n' +
    '    int bg_per_2 = (bg & 0xF7DE) >> 1;\n' +
    '    int bg_per_4 = (bg & 0xE79C) >> 2;\n' +
    '    int bg_per_8 = (bg & 0xC718) >> 3;\n' +
    '    \n' +
    '    if (alpha > 224)\n' +
    '        return fg; // 100% blend\n' +
    '    else if (alpha > 192)\n' +
    '        return (fg - fg_per_8 + bg_per_8); // 88% blend\n' +
    '    else if (alpha > 128)\n' +
    '        return (fg - fg_per_4 + bg_per_4); // 75% blend\n' +
    '    else if (alpha > 64)\n' +
    '        return (fg_per_2 + bg_per_2); // 50% blend\n' +
    '    else if (alpha > 32)\n' +
    '        return (fg_per_4 + bg - bg_per_4); // 25% blend\n' +
    '    else\n' +
    '        return bg; // 0% blend\n' +
    '}\n' +
    '\n' +
    '\n' +
    '// Draws antialiased lines\n' +
    "// Xiaolin Wu's algorithm, using x/256 fixed point values\n" +
    'void drawline_aa(fix16_t x1, fix16_t y1, fix16_t x2, fix16_t y2, int color)\n' +
    '{\n' +
    '    bool reverse_xy = false;\n' +
    '    \n' +
    '    auto swap = [](int *x, int *y) {\n' +
    '        int temp = *x;\n' +
    '        *x = *y;\n' +
    '        *y = temp;\n' +
    '    };\n' +
    '    \n' +
    '    // plot the pixel at (x, y) with brightness c\n' +
    '    auto plot = [&](int x, int y, int c) {\n' +
    '        if (reverse_xy)\n' +
    '            swap(&x, &y);\n' +
    '        \n' +
    '        uint16_t oldcolor = BIOS::LCD::GetPixel(x >> 8, y >> 8);\n' +
    '        BIOS::LCD::PutPixel(x >> 8, y >> 8, blend(color, oldcolor, c));\n' +
    '    };\n' +
    '    \n' +
    '    // Integer part of x\n' +
    '    auto ipart = [](int x) -> int {\n' +
    '        return x & (~0xFF);\n' +
    '    };\n' +
    '    \n' +
    '    auto round = [&](int x) -> int {\n' +
    '        return ipart(x + 128);\n' +
    '    };\n' +
    '    \n' +
    '    // Fractional part of x\n' +
    '    auto fpart = [](int x) -> int {\n' +
    '        return x & 0xFF;\n' +
    '    };\n' +
    '    \n' +
    '    // Remaining fractional part of x\n' +
    '    auto rfpart = [&](int x) -> int {\n' +
    '        return 256 - fpart(x);\n' +
    '    };\n' +
    '\n' +
    '    int dx = x2 - x1;\n' +
    '    int dy = y2 - y1;\n' +
    '    if (abs(dx) < abs(dy))\n' +
    '    {\n' +
    '        swap(&x1, &y1);\n' +
    '        swap(&x2, &y2);\n' +
    '        swap(&dx, &dy);\n' +
    '        reverse_xy = true;\n' +
    '    }\n' +
    '    \n' +
    '    if (x2 < x1)\n' +
    '    {\n' +
    '        swap(&x1, &x2);\n' +
    '        swap(&y1, &y2);\n' +
    '    }\n' +
    '    \n' +
    '    int gradient = dy * 256 / dx;\n' +
    '    \n' +
    '    // handle first endpoint\n' +
    '    int xend = round(x1);\n' +
    '    int yend = y1 + gradient * (xend - x1) / 256;\n' +
    '    int xgap = rfpart(x1 + 128);\n' +
    '    int xpxl1 = xend;  // this will be used in the main loop\n' +
    '    int ypxl1 = ipart(yend);\n' +
    '    plot(xpxl1, ypxl1, rfpart(yend) * xgap / 256);\n' +
    '    plot(xpxl1, ypxl1 + 256, fpart(yend) * xgap / 256);\n' +
    '    int intery = yend + gradient; // first y-intersection for the main loop\n' +
    '    \n' +
    '    // handle second endpoint\n' +
    '    xend = round(x2);\n' +
    '    yend = y2 + gradient * (xend - x2) / 256;\n' +
    '    xgap = fpart(x2 + 128);\n' +
    '    int xpxl2 = xend;  // this will be used in the main loop\n' +
    '    int ypxl2 = ipart(yend);\n' +
    '    plot(xpxl2, ypxl2, rfpart(yend) * xgap / 256);\n' +
    '    plot(xpxl2, ypxl2 + 256, fpart(yend) * xgap / 256);\n' +
    '    \n' +
    '    // main loop\n' +
    '    for (int x = xpxl1 + 1; x <= xpxl2 - 1; x += 256)\n' +
    '    {\n' +
    '        plot(x, ipart(intery), rfpart(intery));\n' +
    '        plot(x, ipart(intery) + 256, fpart(intery));\n' +
    '        intery = intery + gradient;\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    '/* Non-antialiased line drawing */\n' +
    '\n' +
    'void drawline(int x1, int y1, int x2, int y2, int color, int dots)\n' +
    '{\n' +
    '    // Algorithm from here: http://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm#Simplification\n' +
    '    int dx = abs(x2 - x1);\n' +
    '    int dy = abs(y2 - y1);\n' +
    '    \n' +
    '    int sx = (x1 < x2) ? 1 : -1;\n' +
    '    int sy = (y1 < y2) ? 1 : -1;\n' +
    '    \n' +
    '    int err = dx - dy;\n' +
    '    int count = 0;\n' +
    '    for(;; count++)\n' +
    '    {\n' +
    '        if (!dots || (count >> (dots - 1)) & 1)\n' +
    '        {\n' +
    '            //__Point_SCR(x1, y1);\n' +
    '            //__LCD_SetPixl(color);\n' +
    '        }\n' +
    '        \n' +
    '        if (x1 == x2 && y1 == y2) break;\n' +
    '        \n' +
    '        int e2 = 2 * err;\n' +
    '        if (e2 > -dy)\n' +
    '        {\n' +
    '            err -= dy;\n' +
    '            x1 += sx;\n' +
    '        }\n' +
    '        else if (e2 < dx)\n' +
    '        {\n' +
    '            err += dx;\n' +
    '            y1 += sy;\n' +
    '        }\n' +
    '    }\n' +
    '}\n' +
    '\n' +
    '\n',
  'bars.cpp': '#include <library.h>\n' +
    '\n' +
    'using namespace BIOS;\n' +
    '\n' +
    'int main(void)\n' +
    '{\n' +
    '    BIOS::KEY::EKey key;\n' +
    '    while ((key = KEY::GetKey()) != BIOS::KEY::EKey::Escape)\n' +
    '    {\n' +
    '        int x1 = rand() % BIOS::LCD::Width;\n' +
    '        int y1 = rand() % BIOS::LCD::Height;\n' +
    '        int x2 = rand() % BIOS::LCD::Width;\n' +
    '        int y2 = rand() % BIOS::LCD::Height;\n' +
    '        int c = rand() & 0xffff;\n' +
    '        if (x2 > x1 && y2 > y1)\n' +
    '            BIOS::LCD::Bar(x1, y1, x2, y2, c);\n' +
    '    }\n' +
    '    \n' +
    '    return 0;\n' +
    '}\n',
  'counter.cpp': '#include <library.h>\n' +
    '\n' +
    'using namespace BIOS;\n' +
    '\n' +
    'int counter = 0;\n' +
    '\n' +
    'int main(void)\n' +
    '{\n' +
    '    BIOS::KEY::EKey key;\n' +
    '    while ((key = KEY::GetKey()) != BIOS::KEY::EKey::Escape)\n' +
    '    {\n' +
    '        BIOS::DBG::Print("Test %d, ", counter++);\n' +
    '        BIOS::SYS::DelayMs(200);\n' +
    '    }\n' +
    '    \n' +
    '    return 0;\n' +
    '}',
  'hello.cpp': '#include <library.h>\n' +
    '\n' +
    'int main(void)\n' +
    '{\n' +
    '    BIOS::DBG::Print("Hello world!");\n' +
    '    return 724;\n' +
    '}\n',
  'label.cpp': '#include <library.h>\n' +
    '\n' +
    'using namespace BIOS;\n' +
    '\n' +
    'int main(void)\n' +
    '{\n' +
    '    BIOS::KEY::EKey key;\n' +
    '    while ((key = KEY::GetKey()) != BIOS::KEY::EKey::Escape)\n' +
    '    {\n' +
    '        int x1 = rand() % BIOS::LCD::Width;\n' +
    '        int y1 = rand() % BIOS::LCD::Height;\n' +
    '        int x2 = rand() % BIOS::LCD::Width;\n' +
    '        int y2 = rand() % BIOS::LCD::Height;\n' +
    '        int c = rand() & 0xffff;\n' +
    '        if (x2 > x1 && y2 > y1)\n' +
    '        BIOS::LCD::Print(x1, y1, c, RGBTRANS, "Hello!");\n' +
    '    }\n' +
    '    \n' +
    '    return 0;\n' +
    '}',
  'map.cpp': '#include <library.h>\n' +
    '\n' +
    'int main(void)\n' +
    '{\n' +
    `    BIOS::DBG::Print("<div style='position:relative;'>");\n` +
    `    BIOS::DBG::Print("<div style='position:absolute; left:0px; top:80px; width:400px; height:200px;'><img src='https://www.world-maps.org/images/wor32k6.jpg'></div>");\n` +
    `    BIOS::DBG::Print("<div style='position:absolute; left:60px; top:120px; width:8px; height:8px; background:#ff0000;'>On top</div>");\n` +
    '    BIOS::DBG::Print("</div>");\n' +
    '    return 0;\n' +
    '}\n',
  'return.cpp': '#include <library.h>\n\nint main(void)\n{\n    return 724;\n}\n'
}
