// .text
uint8_t data_20005000[0x16] = {
  0x08, 0xb5, 0x00, 0xf0, 0x6d, 0xf8, 0x00, 0xf0, 0x63, 0xf8, 0x00, 0xf0, 0x79, 0xf8, 0x00, 0xf0, 
  0x6f, 0xf8, 0x01, 0x20, 0x08, 0xbd, 
};
WriteMem(data_20005000, 0x16, 0x20005000);
// .plt
uint8_t data_200050c0[0x50] = {
  0x00, 0xb5, 0xdf, 0xf8, 0x08, 0xe0, 0xfe, 0x44, 0x5e, 0xf8, 0x08, 0xff, 0xec, 0x00, 0x00, 0x00, 
  0x40, 0xf2, 0xe8, 0x0c, 0xc0, 0xf2, 0x00, 0x0c, 0xfc, 0x44, 0xdc, 0xf8, 0x00, 0xf0, 0x00, 0xbf, 
  0x40, 0xf2, 0xdc, 0x0c, 0xc0, 0xf2, 0x00, 0x0c, 0xfc, 0x44, 0xdc, 0xf8, 0x00, 0xf0, 0x00, 0xbf, 
  0x40, 0xf2, 0xd0, 0x0c, 0xc0, 0xf2, 0x00, 0x0c, 0xfc, 0x44, 0xdc, 0xf8, 0x00, 0xf0, 0x00, 0xbf, 
  0x40, 0xf2, 0xc4, 0x0c, 0xc0, 0xf2, 0x00, 0x0c, 0xfc, 0x44, 0xdc, 0xf8, 0x00, 0xf0, 0x00, 0xbf, 
};
WriteMem(data_200050c0, 0x50, 0x200050c0);
// .got
uint8_t data_200051b8[0x1c] = {
  0x18, 0x50, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xc0, 0x50, 0x00, 0x20, 
  0xc0, 0x50, 0x00, 0x20, 0xc0, 0x50, 0x00, 0x20, 0xc0, 0x50, 0x00, 0x20, 
};
WriteMem(data_200051b8, 0x1c, 0x200051b8);
// Relocation table
WriteDword(0x200051c4, 0x00000001);
WriteDword(0x200051c8, 0x00000001);
WriteDword(0x200051cc, 0x00000001);
WriteDword(0x200051d0, 0x00000001);
ExecEntry(0x20005000);