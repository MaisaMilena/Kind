module.exports = (function() {
    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u16_to_bits(x) {
        var s = '';
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? '1' : '0') + s;
            x = x >>> 1;
        }
        return s;
    };

    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >>> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === 'Word.i' ? 1n << i : 0n);
            w = w.pred;
        };
        return u;
    };

    function u64_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: (u >> (64n - i - 1n)) & 1n ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32array_to_buffer32(a) {
        function go(a, buffer) {
            switch (a._) {
                case 'Array.tip':
                    buffer.push(a.value);
                    break;
                case 'Array.tie':
                    go(a.lft, buffer);
                    go(a.rgt, buffer);
                    break;
            }
            return buffer;
        };
        return new Uint32Array(go(a, []));
    };

    function buffer32_to_u32array(b) {
        function go(b) {
            if (b.length === 1) {
                return {
                    _: 'Array.tip',
                    value: b[0]
                };
            } else {
                var lft = go(b.slice(0, b.length / 2));
                var rgt = go(b.slice(b.length / 2));
                return {
                    _: 'Array.tie',
                    lft,
                    rgt
                };
            };
        };
        return go(b);
    };

    function buffer32_to_depth(b) {
        return BigInt(Math.log(b.length) / Math.log(2));
    };
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    var list_length = list => {
        var len = 0;
        while (list._ === 'List.cons') {
            len += 1;
            list = list.tail;
        };
        return BigInt(len);
    };
    const inst_unit = x => x(1);
    const elim_unit = (x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
                case 'unit':
                    var $0 = c0;
                    return $0;
            };
        })();
        return $1;
    });
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c2;
                return $2;
            } else {
                var $3 = c2;
                return $3;
            };
        })();
        return $4;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c2;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c2($6);
                return $7;
            };
        })();
        return $8;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $14 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $9 = self.slice(0, -1);
                    var $10 = c1($9);
                    return $10;
                case 'i':
                    var $11 = self.slice(0, -1);
                    var $12 = c2($11);
                    return $12;
                case 'e':
                    var $13 = c0;
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $15 = u16_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $20 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $18 = u32_to_word(self);
                    var $19 = c0($18);
                    return $19;
            };
        })();
        return $20;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $23 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $21 = u64_to_word(self);
                    var $22 = c0($21);
                    return $22;
            };
        })();
        return $23;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $28 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $24 = c2;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c2($25)($26);
                return $27;
            };
        })();
        return $28;
    });
    const inst_buffer32 = x => x(x0 => x1 => u32array_to_buffer32(x1));
    const elim_buffer32 = (x => {
        var $32 = (() => c0 => {
            var self = x;
            switch ('b32') {
                case 'b32':
                    var $29 = buffer32_to_depth(self);
                    var $30 = buffer32_to_u32array(self);
                    var $31 = c0($29)($30);
                    return $31;
            };
        })();
        return $32;
    });

    function Buffer32$new$(_depth$1, _array$2) {
        var $33 = u32array_to_buffer32(_array$2);
        return $33;
    };
    const Buffer32$new = x0 => x1 => Buffer32$new$(x0, x1);

    function Array$(_A$1, _depth$2) {
        var $34 = null;
        return $34;
    };
    const Array = x0 => x1 => Array$(x0, x1);

    function Array$tip$(_value$2) {
        var $35 = ({
            _: 'Array.tip',
            'value': _value$2
        });
        return $35;
    };
    const Array$tip = x0 => Array$tip$(x0);

    function Array$tie$(_lft$3, _rgt$4) {
        var $36 = ({
            _: 'Array.tie',
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $36;
    };
    const Array$tie = x0 => x1 => Array$tie$(x0, x1);

    function Array$alloc$(_depth$2, _x$3) {
        var self = _depth$2;
        if (self === 0n) {
            var $38 = Array$tip$(_x$3);
            var $37 = $38;
        } else {
            var $39 = (self - 1n);
            var _half$5 = Array$alloc$($39, _x$3);
            var $40 = Array$tie$(_half$5, _half$5);
            var $37 = $40;
        };
        return $37;
    };
    const Array$alloc = x0 => x1 => Array$alloc$(x0, x1);

    function U32$new$(_value$1) {
        var $41 = word_to_u32(_value$1);
        return $41;
    };
    const U32$new = x0 => U32$new$(x0);

    function Word$(_size$1) {
        var $42 = null;
        return $42;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$o$(_pred$2) {
        var $43 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $43;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $45 = Word$e;
            var $44 = $45;
        } else {
            var $46 = (self - 1n);
            var $47 = Word$o$(Word$zero$($46));
            var $44 = $47;
        };
        return $44;
    };
    const Word$zero = x0 => Word$zero$(x0);
    const U32$zero = U32$new$(Word$zero$(32n));
    const Buffer32$alloc = a0 => (new Uint32Array(2 ** Number(a0)));
    const Bool$false = false;
    const Bool$true = true;

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $49 = Bool$false;
                var $48 = $49;
                break;
            case 'Cmp.eql':
                var $50 = Bool$true;
                var $48 = $50;
                break;
        };
        return $48;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);
    const Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    const Cmp$gtn = ({
        _: 'Cmp.gtn'
    });

    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $52 = self.pred;
                var $53 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $55 = self.pred;
                            var $56 = (_a$pred$10 => {
                                var $57 = Word$cmp$go$(_a$pred$10, $55, _c$4);
                                return $57;
                            });
                            var $54 = $56;
                            break;
                        case 'Word.i':
                            var $58 = self.pred;
                            var $59 = (_a$pred$10 => {
                                var $60 = Word$cmp$go$(_a$pred$10, $58, Cmp$ltn);
                                return $60;
                            });
                            var $54 = $59;
                            break;
                        case 'Word.e':
                            var $61 = (_a$pred$8 => {
                                var $62 = _c$4;
                                return $62;
                            });
                            var $54 = $61;
                            break;
                    };
                    var $54 = $54($52);
                    return $54;
                });
                var $51 = $53;
                break;
            case 'Word.i':
                var $63 = self.pred;
                var $64 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $66 = self.pred;
                            var $67 = (_a$pred$10 => {
                                var $68 = Word$cmp$go$(_a$pred$10, $66, Cmp$gtn);
                                return $68;
                            });
                            var $65 = $67;
                            break;
                        case 'Word.i':
                            var $69 = self.pred;
                            var $70 = (_a$pred$10 => {
                                var $71 = Word$cmp$go$(_a$pred$10, $69, _c$4);
                                return $71;
                            });
                            var $65 = $70;
                            break;
                        case 'Word.e':
                            var $72 = (_a$pred$8 => {
                                var $73 = _c$4;
                                return $73;
                            });
                            var $65 = $72;
                            break;
                    };
                    var $65 = $65($63);
                    return $65;
                });
                var $51 = $64;
                break;
            case 'Word.e':
                var $74 = (_b$5 => {
                    var $75 = _c$4;
                    return $75;
                });
                var $51 = $74;
                break;
        };
        var $51 = $51(_b$3);
        return $51;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $76 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $76;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $77 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $77;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $78 = 1n + _pred$1;
        return $78;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U32$eql = a0 => a1 => (a0 === a1);

    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: 'TCO',
            arg: [_n$2, _f$3, _x$4]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [_n$2, _f$3, _x$4];
        while (true) {
            let [_n$2, _f$3, _x$4] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $79 = _x$4;
                    return $79;
                } else {
                    var $80 = (self - 1n);
                    var $81 = Nat$apply$($80, _f$3, _f$3(_x$4));
                    return $81;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$i$(_pred$2) {
        var $82 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $82;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $84 = self.pred;
                var $85 = Word$i$($84);
                var $83 = $85;
                break;
            case 'Word.i':
                var $86 = self.pred;
                var $87 = Word$o$(Word$inc$($86));
                var $83 = $87;
                break;
            case 'Word.e':
                var $88 = Word$e;
                var $83 = $88;
                break;
        };
        return $83;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function U32$inc$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $90 = u32_to_word(self);
                var $91 = U32$new$(Word$inc$($90));
                var $89 = $91;
                break;
        };
        return $89;
    };
    const U32$inc = x0 => U32$inc$(x0);
    const Nat$to_u32 = a0 => (Number(a0));
    const U32$shr = a0 => a1 => (a0 >>> a1);

    function U32$needed_depth$go$(_n$1) {
        var self = (_n$1 === 0);
        if (self) {
            var $93 = 0n;
            var $92 = $93;
        } else {
            var $94 = Nat$succ$(U32$needed_depth$go$((_n$1 >>> 1)));
            var $92 = $94;
        };
        return $92;
    };
    const U32$needed_depth$go = x0 => U32$needed_depth$go$(x0);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $96 = self.pred;
                var $97 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $99 = self.pred;
                            var $100 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $102 = Word$i$(Word$subber$(_a$pred$10, $99, Bool$true));
                                    var $101 = $102;
                                } else {
                                    var $103 = Word$o$(Word$subber$(_a$pred$10, $99, Bool$false));
                                    var $101 = $103;
                                };
                                return $101;
                            });
                            var $98 = $100;
                            break;
                        case 'Word.i':
                            var $104 = self.pred;
                            var $105 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $107 = Word$o$(Word$subber$(_a$pred$10, $104, Bool$true));
                                    var $106 = $107;
                                } else {
                                    var $108 = Word$i$(Word$subber$(_a$pred$10, $104, Bool$true));
                                    var $106 = $108;
                                };
                                return $106;
                            });
                            var $98 = $105;
                            break;
                        case 'Word.e':
                            var $109 = (_a$pred$8 => {
                                var $110 = Word$e;
                                return $110;
                            });
                            var $98 = $109;
                            break;
                    };
                    var $98 = $98($96);
                    return $98;
                });
                var $95 = $97;
                break;
            case 'Word.i':
                var $111 = self.pred;
                var $112 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $114 = self.pred;
                            var $115 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $117 = Word$o$(Word$subber$(_a$pred$10, $114, Bool$false));
                                    var $116 = $117;
                                } else {
                                    var $118 = Word$i$(Word$subber$(_a$pred$10, $114, Bool$false));
                                    var $116 = $118;
                                };
                                return $116;
                            });
                            var $113 = $115;
                            break;
                        case 'Word.i':
                            var $119 = self.pred;
                            var $120 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $122 = Word$i$(Word$subber$(_a$pred$10, $119, Bool$true));
                                    var $121 = $122;
                                } else {
                                    var $123 = Word$o$(Word$subber$(_a$pred$10, $119, Bool$false));
                                    var $121 = $123;
                                };
                                return $121;
                            });
                            var $113 = $120;
                            break;
                        case 'Word.e':
                            var $124 = (_a$pred$8 => {
                                var $125 = Word$e;
                                return $125;
                            });
                            var $113 = $124;
                            break;
                    };
                    var $113 = $113($111);
                    return $113;
                });
                var $95 = $112;
                break;
            case 'Word.e':
                var $126 = (_b$5 => {
                    var $127 = Word$e;
                    return $127;
                });
                var $95 = $126;
                break;
        };
        var $95 = $95(_b$3);
        return $95;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $128 = Word$subber$(_a$2, _b$3, Bool$false);
        return $128;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U32$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function U32$needed_depth$(_size$1) {
        var $129 = U32$needed_depth$go$((Math.max(_size$1 - 1, 0)));
        return $129;
    };
    const U32$needed_depth = x0 => U32$needed_depth$(x0);

    function Word$mul$(_a$2, _b$3) {
        var Word$mul$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$mul = _a$2 => _b$3 => Word$mul$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$mul$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);

    function Image3D$new$(_length$1, _capacity$2, _buffer$3) {
        var $130 = ({
            _: 'Image3D.new',
            'length': _length$1,
            'capacity': _capacity$2,
            'buffer': _buffer$3
        });
        return $130;
    };
    const Image3D$new = x0 => x1 => x2 => Image3D$new$(x0, x1, x2);

    function Image3D$alloc_capacity$(_capacity$1) {
        var _buffer$2 = (new Uint32Array(2 ** Number(U32$needed_depth$(((2 * _capacity$1) >>> 0)))));
        var $131 = Image3D$new$(0, _capacity$1, _buffer$2);
        return $131;
    };
    const Image3D$alloc_capacity = x0 => Image3D$alloc_capacity$(x0);
    const Map$new = ({
        _: 'Map.new'
    });

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $133 = self.pred;
                var $134 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $136 = self.pred;
                            var $137 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $139 = Word$i$(Word$adder$(_a$pred$10, $136, Bool$false));
                                    var $138 = $139;
                                } else {
                                    var $140 = Word$o$(Word$adder$(_a$pred$10, $136, Bool$false));
                                    var $138 = $140;
                                };
                                return $138;
                            });
                            var $135 = $137;
                            break;
                        case 'Word.i':
                            var $141 = self.pred;
                            var $142 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $144 = Word$o$(Word$adder$(_a$pred$10, $141, Bool$true));
                                    var $143 = $144;
                                } else {
                                    var $145 = Word$i$(Word$adder$(_a$pred$10, $141, Bool$false));
                                    var $143 = $145;
                                };
                                return $143;
                            });
                            var $135 = $142;
                            break;
                        case 'Word.e':
                            var $146 = (_a$pred$8 => {
                                var $147 = Word$e;
                                return $147;
                            });
                            var $135 = $146;
                            break;
                    };
                    var $135 = $135($133);
                    return $135;
                });
                var $132 = $134;
                break;
            case 'Word.i':
                var $148 = self.pred;
                var $149 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $151 = self.pred;
                            var $152 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $154 = Word$o$(Word$adder$(_a$pred$10, $151, Bool$true));
                                    var $153 = $154;
                                } else {
                                    var $155 = Word$i$(Word$adder$(_a$pred$10, $151, Bool$false));
                                    var $153 = $155;
                                };
                                return $153;
                            });
                            var $150 = $152;
                            break;
                        case 'Word.i':
                            var $156 = self.pred;
                            var $157 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $159 = Word$i$(Word$adder$(_a$pred$10, $156, Bool$true));
                                    var $158 = $159;
                                } else {
                                    var $160 = Word$o$(Word$adder$(_a$pred$10, $156, Bool$true));
                                    var $158 = $160;
                                };
                                return $158;
                            });
                            var $150 = $157;
                            break;
                        case 'Word.e':
                            var $161 = (_a$pred$8 => {
                                var $162 = Word$e;
                                return $162;
                            });
                            var $150 = $161;
                            break;
                    };
                    var $150 = $150($148);
                    return $150;
                });
                var $132 = $149;
                break;
            case 'Word.e':
                var $163 = (_b$5 => {
                    var $164 = Word$e;
                    return $164;
                });
                var $132 = $163;
                break;
        };
        var $132 = $132(_b$3);
        return $132;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $165 = Word$adder$(_a$2, _b$3, Bool$false);
        return $165;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function List$ifor_u32$(_xs$2, _b$4, _f$5) {
        var List$ifor_u32$ = (_xs$2, _b$4, _f$5) => ({
            ctr: 'TCO',
            arg: [_xs$2, _b$4, _f$5]
        });
        var List$ifor_u32 = _xs$2 => _b$4 => _f$5 => List$ifor_u32$(_xs$2, _b$4, _f$5);
        var arg = [_xs$2, _b$4, _f$5];
        while (true) {
            let [_xs$2, _b$4, _f$5] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $166 = self.head;
                        var $167 = self.tail;
                        var $168 = List$ifor_u32$($167, _f$5(0)($166)(_b$4), (_n$8 => {
                            var $169 = _f$5(((_n$8 + 1) >>> 0));
                            return $169;
                        }));
                        return $168;
                    case 'List.nil':
                        var $170 = _b$4;
                        return $170;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$ifor_u32 = x0 => x1 => x2 => List$ifor_u32$(x0, x1, x2);

    function List$(_A$1) {
        var $171 = null;
        return $171;
    };
    const List = x0 => List$(x0);

    function Map$(_A$1) {
        var $172 = null;
        return $172;
    };
    const Map = x0 => Map$(x0);
    const Mons$Map$new = Map$new;

    function List$length_u32_go$(_xs$2, _n$3) {
        var List$length_u32_go$ = (_xs$2, _n$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _n$3]
        });
        var List$length_u32_go = _xs$2 => _n$3 => List$length_u32_go$(_xs$2, _n$3);
        var arg = [_xs$2, _n$3];
        while (true) {
            let [_xs$2, _n$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $173 = self.tail;
                        var $174 = List$length_u32_go$($173, ((1 + _n$3) >>> 0));
                        return $174;
                    case 'List.nil':
                        var $175 = _n$3;
                        return $175;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$length_u32_go = x0 => x1 => List$length_u32_go$(x0, x1);

    function List$length_u32$(_xs$2) {
        var $176 = List$length_u32_go$(_xs$2, 0);
        return $176;
    };
    const List$length_u32 = x0 => List$length_u32$(x0);
    const U32$for = a0 => a1 => a2 => a3 => (u32_for(a0, a1, a2, a3));

    function Word$div$(_a$2, _b$3) {
        var Word$div$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$div = _a$2 => _b$3 => Word$div$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$div$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U32$div = a0 => a1 => ((a0 / a1) >>> 0);

    function Word$or$(_a$2, _b$3) {
        var Word$or$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$or = _a$2 => _b$3 => Word$or$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$or$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);
    const U32$or = a0 => a1 => (a0 | a1);
    const U32$shl = a0 => a1 => (a0 << a1);
    const Pos32$new = a0 => a1 => a2 => ((0 | a0 | (a1 << 12) | (a2 << 24)));

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $178 = self.pred;
                var $179 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $178));
                var $177 = $179;
                break;
            case 'Word.i':
                var $180 = self.pred;
                var $181 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $180));
                var $177 = $181;
                break;
            case 'Word.e':
                var $182 = _nil$3;
                var $177 = $182;
                break;
        };
        return $177;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Word$to_nat$(_word$2) {
        var $183 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $184 = Nat$succ$((2n * _x$4));
            return $184;
        }), _word$2);
        return $183;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function U32$to_nat$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $186 = u32_to_word(self);
                var $187 = Word$to_nat$($186);
                var $185 = $187;
                break;
        };
        return $185;
    };
    const U32$to_nat = x0 => U32$to_nat$(x0);
    const String$nil = '';

    function String$cons$(_head$1, _tail$2) {
        var $188 = (String.fromCharCode(_head$1) + _tail$2);
        return $188;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);

    function String$take$(_n$1, _xs$2) {
        var self = _xs$2;
        if (self.length === 0) {
            var $190 = String$nil;
            var $189 = $190;
        } else {
            var $191 = self.charCodeAt(0);
            var $192 = self.slice(1);
            var self = _n$1;
            if (self === 0n) {
                var $194 = String$nil;
                var $193 = $194;
            } else {
                var $195 = (self - 1n);
                var $196 = String$cons$($191, String$take$($195, $192));
                var $193 = $196;
            };
            var $189 = $193;
        };
        return $189;
    };
    const String$take = x0 => x1 => String$take$(x0, x1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function String$drop$(_n$1, _xs$2) {
        var String$drop$ = (_n$1, _xs$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _xs$2]
        });
        var String$drop = _n$1 => _xs$2 => String$drop$(_n$1, _xs$2);
        var arg = [_n$1, _xs$2];
        while (true) {
            let [_n$1, _xs$2] = arg;
            var R = (() => {
                var self = _n$1;
                if (self === 0n) {
                    var $197 = _xs$2;
                    return $197;
                } else {
                    var $198 = (self - 1n);
                    var self = _xs$2;
                    if (self.length === 0) {
                        var $200 = String$nil;
                        var $199 = $200;
                    } else {
                        var $201 = self.charCodeAt(0);
                        var $202 = self.slice(1);
                        var $203 = String$drop$($198, $202);
                        var $199 = $203;
                    };
                    return $199;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$drop = x0 => x1 => String$drop$(x0, x1);

    function String$slice$(_i$1, _j$2, _xs$3) {
        var $204 = String$take$((_j$2 - _i$1 <= 0n ? 0n : _j$2 - _i$1), String$drop$(_i$1, _xs$3));
        return $204;
    };
    const String$slice = x0 => x1 => x2 => String$slice$(x0, x1, x2);

    function Map$tie$(_val$2, _lft$3, _rgt$4) {
        var $205 = ({
            _: 'Map.tie',
            'val': _val$2,
            'lft': _lft$3,
            'rgt': _rgt$4
        });
        return $205;
    };
    const Map$tie = x0 => x1 => x2 => Map$tie$(x0, x1, x2);

    function Maybe$some$(_value$2) {
        var $206 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $206;
    };
    const Maybe$some = x0 => Maybe$some$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Map$set$(_bits$2, _val$3, _map$4) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $208 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $210 = self.val;
                        var $211 = self.lft;
                        var $212 = self.rgt;
                        var $213 = Map$tie$($210, Map$set$($208, _val$3, $211), $212);
                        var $209 = $213;
                        break;
                    case 'Map.new':
                        var $214 = Map$tie$(Maybe$none, Map$set$($208, _val$3, Map$new), Map$new);
                        var $209 = $214;
                        break;
                };
                var $207 = $209;
                break;
            case 'i':
                var $215 = self.slice(0, -1);
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $217 = self.val;
                        var $218 = self.lft;
                        var $219 = self.rgt;
                        var $220 = Map$tie$($217, $218, Map$set$($215, _val$3, $219));
                        var $216 = $220;
                        break;
                    case 'Map.new':
                        var $221 = Map$tie$(Maybe$none, Map$new, Map$set$($215, _val$3, Map$new));
                        var $216 = $221;
                        break;
                };
                var $207 = $216;
                break;
            case 'e':
                var self = _map$4;
                switch (self._) {
                    case 'Map.tie':
                        var $223 = self.lft;
                        var $224 = self.rgt;
                        var $225 = Map$tie$(Maybe$some$(_val$3), $223, $224);
                        var $222 = $225;
                        break;
                    case 'Map.new':
                        var $226 = Map$tie$(Maybe$some$(_val$3), Map$new, Map$new);
                        var $222 = $226;
                        break;
                };
                var $207 = $222;
                break;
        };
        return $207;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');
    const Bits$i = a0 => (a0 + '1');

    function Word$to_bits$(_a$2) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $228 = self.pred;
                var $229 = (Word$to_bits$($228) + '0');
                var $227 = $229;
                break;
            case 'Word.i':
                var $230 = self.pred;
                var $231 = (Word$to_bits$($230) + '1');
                var $227 = $231;
                break;
            case 'Word.e':
                var $232 = Bits$e;
                var $227 = $232;
                break;
        };
        return $227;
    };
    const Word$to_bits = x0 => Word$to_bits$(x0);

    function U32$to_bits$(_a$1) {
        var self = _a$1;
        switch ('u32') {
            case 'u32':
                var $234 = u32_to_word(self);
                var $235 = Word$to_bits$($234);
                var $233 = $235;
                break;
        };
        return $233;
    };
    const U32$to_bits = x0 => U32$to_bits$(x0);

    function Mons$Map$set_list$(_pos$1, _objs$2, _map$3) {
        var $236 = Map$set$(U32$to_bits$(_pos$1), _objs$2, _map$3);
        return $236;
    };
    const Mons$Map$set_list = x0 => x1 => x2 => Mons$Map$set_list$(x0, x1, x2);

    function Mons$Object$new$(_kin$1, _dir$2, _pad$3, _ani$4, _dmg$5, _bag$6, _mon$7, _bos$8, _cap$9, _idl$10, _eff$11) {
        var $237 = ({
            _: 'Mons.Object.new',
            'kin': _kin$1,
            'dir': _dir$2,
            'pad': _pad$3,
            'ani': _ani$4,
            'dmg': _dmg$5,
            'bag': _bag$6,
            'mon': _mon$7,
            'bos': _bos$8,
            'cap': _cap$9,
            'idl': _idl$10,
            'eff': _eff$11
        });
        return $237;
    };
    const Mons$Object$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => Mons$Object$new$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10);
    const Mons$Dir$down = ({
        _: 'Mons.Dir.down'
    });

    function Mons$Pad$new$(_r$1, _u$2, _l$3, _d$4) {
        var $238 = ({
            _: 'Mons.Pad.new',
            'r': _r$1,
            'u': _u$2,
            'l': _l$3,
            'd': _d$4
        });
        return $238;
    };
    const Mons$Pad$new = x0 => x1 => x2 => x3 => Mons$Pad$new$(x0, x1, x2, x3);
    const Mons$Pad$null = Mons$Pad$new$(Bool$false, Bool$false, Bool$false, Bool$false);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$new$(_fst$3, _snd$4) {
        var $239 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $239;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Mons$Effect$new$(_sleep$1, _burn$2, _protect$3, _minimize$4, _invulnerable$5, _hit$6, _poison$7, _swap_agi$8) {
        var $240 = ({
            _: 'Mons.Effect.new',
            'sleep': _sleep$1,
            'burn': _burn$2,
            'protect': _protect$3,
            'minimize': _minimize$4,
            'invulnerable': _invulnerable$5,
            'hit': _hit$6,
            'poison': _poison$7,
            'swap_agi': _swap_agi$8
        });
        return $240;
    };
    const Mons$Effect$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Mons$Effect$new$(x0, x1, x2, x3, x4, x5, x6, x7);
    const Mons$Effect$clear = (() => {
        var _clean$1 = Pair$new$(0, Bool$false);
        var _clean_bool$2 = Pair$new$(Bool$false, Bool$false);
        var $241 = Mons$Effect$new$(_clean$1, 0, _clean$1, _clean$1, _clean_bool$2, 0, Bool$false, Bool$false);
        return $241;
    })();

    function Mons$Object$new_of_kind$(_kin$1) {
        var $242 = Mons$Object$new$(_kin$1, Mons$Dir$down, Mons$Pad$null, 0, 0, List$nil, 0, List$nil, Pair$new$(11, List$nil), 0, Mons$Effect$clear);
        return $242;
    };
    const Mons$Object$new_of_kind = x0 => Mons$Object$new_of_kind$(x0);

    function Mons$Kind$Terrain$(_ele$1) {
        var $243 = ({
            _: 'Mons.Kind.Terrain',
            'ele': _ele$1
        });
        return $243;
    };
    const Mons$Kind$Terrain = x0 => Mons$Kind$Terrain$(x0);

    function Mons$Kind$new_terrain$(_kin$1) {
        var $244 = Mons$Object$new_of_kind$(Mons$Kind$Terrain$(_kin$1));
        return $244;
    };
    const Mons$Kind$new_terrain = x0 => Mons$Kind$new_terrain$(x0);

    function Mons$Kind$terrain$FLOOR$(_lvl$1, _model$2) {
        var $245 = ({
            _: 'Mons.Kind.terrain.FLOOR',
            'lvl': _lvl$1,
            'model': _model$2
        });
        return $245;
    };
    const Mons$Kind$terrain$FLOOR = x0 => x1 => Mons$Kind$terrain$FLOOR$(x0, x1);

    function Mons$Kind$terrain$PATH_BLOCKER$(_lvl$1, _model$2) {
        var $246 = ({
            _: 'Mons.Kind.terrain.PATH_BLOCKER',
            'lvl': _lvl$1,
            'model': _model$2
        });
        return $246;
    };
    const Mons$Kind$terrain$PATH_BLOCKER = x0 => x1 => Mons$Kind$terrain$PATH_BLOCKER$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);
    const U16$eql = a0 => a1 => (a0 === a1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Mons$Map$code_to_tile$aux$(_code$1, _cond$2) {
        var Mons$Map$code_to_tile$aux$ = (_code$1, _cond$2) => ({
            ctr: 'TCO',
            arg: [_code$1, _cond$2]
        });
        var Mons$Map$code_to_tile$aux = _code$1 => _cond$2 => Mons$Map$code_to_tile$aux$(_code$1, _cond$2);
        var arg = [_code$1, _cond$2];
        while (true) {
            let [_code$1, _cond$2] = arg;
            var R = (() => {
                var self = _cond$2;
                switch (self._) {
                    case 'List.cons':
                        var $247 = self.head;
                        var $248 = self.tail;
                        var self = $247;
                        switch (self._) {
                            case 'Pair.new':
                                var $250 = self.fst;
                                var $251 = self.snd;
                                var self = (_code$1 === $250);
                                if (self) {
                                    var $253 = $251;
                                    var $252 = $253;
                                } else {
                                    var $254 = Mons$Map$code_to_tile$aux$(_code$1, $248);
                                    var $252 = $254;
                                };
                                var $249 = $252;
                                break;
                        };
                        return $249;
                    case 'List.nil':
                        var $255 = List$nil;
                        return $255;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Mons$Map$code_to_tile$aux = x0 => x1 => Mons$Map$code_to_tile$aux$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $256 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $256;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $257 = null;
        return $257;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Mons$Kind$Mons$(_ele$1, _boss$2, _pri_type$3, _agi$4) {
        var $258 = ({
            _: 'Mons.Kind.Mons',
            'ele': _ele$1,
            'boss': _boss$2,
            'pri_type': _pri_type$3,
            'agi': _agi$4
        });
        return $258;
    };
    const Mons$Kind$Mons = x0 => x1 => x2 => x3 => Mons$Kind$Mons$(x0, x1, x2, x3);

    function Mons$Kind$new_mons$(_kin$1, _type$2, _agi$3) {
        var $259 = List$cons$(Mons$Object$new_of_kind$(Mons$Kind$Mons$(_kin$1, Bool$false, _type$2, _agi$3)), List$nil);
        return $259;
    };
    const Mons$Kind$new_mons = x0 => x1 => x2 => Mons$Kind$new_mons$(x0, x1, x2);
    const Mons$Kind$mons$MAGE = ({
        _: 'Mons.Kind.mons.MAGE'
    });
    const Mons$Type$normal = ({
        _: 'Mons.Type.normal'
    });

    function Mons$Kind$Const$(_ele$1) {
        var $260 = ({
            _: 'Mons.Kind.Const',
            'ele': _ele$1
        });
        return $260;
    };
    const Mons$Kind$Const = x0 => Mons$Kind$Const$(x0);

    function Mons$Kind$new_const$(_kin$1) {
        var $261 = Mons$Object$new_of_kind$(Mons$Kind$Const$(_kin$1));
        return $261;
    };
    const Mons$Kind$new_const = x0 => Mons$Kind$new_const$(x0);
    const Mons$Kind$const$CRYSTAL = ({
        _: 'Mons.Kind.const.CRYSTAL'
    });

    function Mons$Kind$const$FOUNTAIN$(_model$1, _slice$2) {
        var $262 = ({
            _: 'Mons.Kind.const.FOUNTAIN',
            'model': _model$1,
            'slice': _slice$2
        });
        return $262;
    };
    const Mons$Kind$const$FOUNTAIN = x0 => x1 => Mons$Kind$const$FOUNTAIN$(x0, x1);
    const Mons$Kind$const$PORTAL = ({
        _: 'Mons.Kind.const.PORTAL'
    });
    const Mons$Kind$terrain$VOID_BLACK = ({
        _: 'Mons.Kind.terrain.VOID_BLACK'
    });

    function Mons$Kind$terrain$MID_CITY$(_row$1, _column$2) {
        var $263 = ({
            _: 'Mons.Kind.terrain.MID_CITY',
            'row': _row$1,
            'column': _column$2
        });
        return $263;
    };
    const Mons$Kind$terrain$MID_CITY = x0 => x1 => Mons$Kind$terrain$MID_CITY$(x0, x1);

    function Mons$Kind$terrain$STAIRS$(_row$1, _column$2) {
        var $264 = ({
            _: 'Mons.Kind.terrain.STAIRS',
            'row': _row$1,
            'column': _column$2
        });
        return $264;
    };
    const Mons$Kind$terrain$STAIRS = x0 => x1 => Mons$Kind$terrain$STAIRS$(x0, x1);

    function Mons$Kind$Interactive$(_ele$1, _on$2, _eff$3) {
        var $265 = ({
            _: 'Mons.Kind.Interactive',
            'ele': _ele$1,
            'on': _on$2,
            'eff': _eff$3
        });
        return $265;
    };
    const Mons$Kind$Interactive = x0 => x1 => x2 => Mons$Kind$Interactive$(x0, x1, x2);

    function Mons$Kind$new_interactive_tool$(_kin$1, _stt$2, _fun$3) {
        var $266 = Mons$Object$new_of_kind$(Mons$Kind$Interactive$(_kin$1, _stt$2, _fun$3));
        return $266;
    };
    const Mons$Kind$new_interactive_tool = x0 => x1 => x2 => Mons$Kind$new_interactive_tool$(x0, x1, x2);
    const Mons$Kind$inter$HEAL = ({
        _: 'Mons.Kind.inter.HEAL'
    });

    function Maybe$(_A$1) {
        var $267 = null;
        return $267;
    };
    const Maybe = x0 => Maybe$(x0);

    function Map$get$(_bits$2, _map$3) {
        var Map$get$ = (_bits$2, _map$3) => ({
            ctr: 'TCO',
            arg: [_bits$2, _map$3]
        });
        var Map$get = _bits$2 => _map$3 => Map$get$(_bits$2, _map$3);
        var arg = [_bits$2, _map$3];
        while (true) {
            let [_bits$2, _map$3] = arg;
            var R = (() => {
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $268 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $270 = self.lft;
                                var $271 = Map$get$($268, $270);
                                var $269 = $271;
                                break;
                            case 'Map.new':
                                var $272 = Maybe$none;
                                var $269 = $272;
                                break;
                        };
                        return $269;
                    case 'i':
                        var $273 = self.slice(0, -1);
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $275 = self.rgt;
                                var $276 = Map$get$($273, $275);
                                var $274 = $276;
                                break;
                            case 'Map.new':
                                var $277 = Maybe$none;
                                var $274 = $277;
                                break;
                        };
                        return $274;
                    case 'e':
                        var self = _map$3;
                        switch (self._) {
                            case 'Map.tie':
                                var $279 = self.val;
                                var $280 = $279;
                                var $278 = $280;
                                break;
                            case 'Map.new':
                                var $281 = Maybe$none;
                                var $278 = $281;
                                break;
                        };
                        return $278;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Mons$Game$get_user_pos$(_user$1, _game$2) {
        var self = _game$2;
        switch (self._) {
            case 'Mons.Game.new':
                var $283 = self.pos;
                var $284 = Map$get$(Word$to_bits$(_user$1), $283);
                var $282 = $284;
                break;
        };
        return $282;
    };
    const Mons$Game$get_user_pos = x0 => x1 => Mons$Game$get_user_pos$(x0, x1);

    function Mons$Game$get_hero_pos$(_game$1) {
        var self = _game$1;
        switch (self._) {
            case 'Mons.Game.new':
                var $286 = self.usr;
                var $287 = Mons$Game$get_user_pos$($286, _game$1);
                var $285 = $287;
                break;
        };
        return $285;
    };
    const Mons$Game$get_hero_pos = x0 => Mons$Game$get_hero_pos$(x0);

    function Word$and$(_a$2, _b$3) {
        var Word$and$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$and = _a$2 => _b$3 => Word$and$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$and$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U32$and = a0 => a1 => (a0 & a1);
    const Pos32$get_x = a0 => ((a0 & 0xFFF));
    const Pos32$get_y = a0 => (((a0 >>> 12) & 0xFFF));
    const Pos32$get_z = a0 => ((a0 >>> 24));

    function Mons$Map$get_list$(_pos$1, _map$2) {
        var self = Map$get$(U32$to_bits$(_pos$1), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $289 = self.value;
                var $290 = $289;
                var $288 = $290;
                break;
            case 'Maybe.none':
                var $291 = List$nil;
                var $288 = $291;
                break;
        };
        return $288;
    };
    const Mons$Map$get_list = x0 => x1 => Mons$Map$get_list$(x0, x1);

    function Mons$Kind$is_hero$(_kind$1) {
        var self = _kind$1;
        switch (self._) {
            case 'Mons.Kind.Mons':
                var $293 = self.ele;
                var self = $293;
                switch (self._) {
                    case 'Mons.Kind.mons.HERO':
                        var $295 = Bool$true;
                        var $294 = $295;
                        break;
                    case 'Mons.Kind.mons.MAGE':
                    case 'Mons.Kind.mons.BEHOLDER':
                    case 'Mons.Kind.mons.ZOIO':
                    case 'Mons.Kind.mons.CYCLOPE':
                    case 'Mons.Kind.mons.POISOLICK':
                    case 'Mons.Kind.mons.TROWL':
                    case 'Mons.Kind.mons.MIMIC':
                    case 'Mons.Kind.mons.MIMIC2':
                    case 'Mons.Kind.mons.AZULA':
                    case 'Mons.Kind.mons.EMERELDER':
                    case 'Mons.Kind.mons.EMERELDER2':
                        var $296 = Bool$false;
                        var $294 = $296;
                        break;
                };
                var $292 = $294;
                break;
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Terrain':
            case 'Mons.Kind.Interactive':
                var $297 = Bool$false;
                var $292 = $297;
                break;
        };
        return $292;
    };
    const Mons$Kind$is_hero = x0 => Mons$Kind$is_hero$(x0);

    function Mons$Object$get_kin$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $299 = self.kin;
                var $300 = $299;
                var $298 = $300;
                break;
        };
        return $298;
    };
    const Mons$Object$get_kin = x0 => Mons$Object$get_kin$(x0);

    function List$ifind$go$(_xs$2, _f$3, _i$4) {
        var List$ifind$go$ = (_xs$2, _f$3, _i$4) => ({
            ctr: 'TCO',
            arg: [_xs$2, _f$3, _i$4]
        });
        var List$ifind$go = _xs$2 => _f$3 => _i$4 => List$ifind$go$(_xs$2, _f$3, _i$4);
        var arg = [_xs$2, _f$3, _i$4];
        while (true) {
            let [_xs$2, _f$3, _i$4] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $301 = self.head;
                        var $302 = self.tail;
                        var self = _f$3($301)(_i$4);
                        if (self) {
                            var $304 = Maybe$some$(Pair$new$($301, _i$4));
                            var $303 = $304;
                        } else {
                            var $305 = List$ifind$go$($302, _f$3, Nat$succ$(_i$4));
                            var $303 = $305;
                        };
                        return $303;
                    case 'List.nil':
                        var $306 = Maybe$none;
                        return $306;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$ifind$go = x0 => x1 => x2 => List$ifind$go$(x0, x1, x2);

    function List$ifind$(_xs$2, _f$3) {
        var $307 = List$ifind$go$(_xs$2, _f$3, Nat$zero);
        return $307;
    };
    const List$ifind = x0 => x1 => List$ifind$(x0, x1);
    const Mons$Kind$terrain$VOID = ({
        _: 'Mons.Kind.terrain.VOID'
    });
    const Mons$Object$void = (() => {
        var _void$1 = Mons$Kind$Terrain$(Mons$Kind$terrain$VOID);
        var $308 = Mons$Object$new$(_void$1, Mons$Dir$down, Mons$Pad$null, 0, 0, List$nil, 0, List$nil, Pair$new$(33, List$nil), 0, Mons$Effect$clear);
        return $308;
    })();

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $310 = self.fst;
                var $311 = $310;
                var $309 = $311;
                break;
        };
        return $309;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $313 = self.snd;
                var $314 = $313;
                var $312 = $314;
                break;
        };
        return $312;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function Mons$Map$get_hero$(_pos$1, _map$2) {
        var _tile$3 = Mons$Map$get_list$(_pos$1, _map$2);
        var _obj_is_hero$4 = (_obj$4 => {
            var $316 = Mons$Kind$is_hero$(Mons$Object$get_kin$(_obj$4));
            return $316;
        });
        var _fun$5 = (_obj$5 => _idx$6 => {
            var $317 = _obj_is_hero$4(_obj$5);
            return $317;
        });
        var _both$6 = List$ifind$(_tile$3, _fun$5);
        var self = _both$6;
        switch (self._) {
            case 'Maybe.some':
                var $318 = self.value;
                var _hero$8 = Pair$fst$($318);
                var _idx$9 = (Number(Pair$snd$($318)));
                var $319 = Pair$new$(_hero$8, _idx$9);
                var $315 = $319;
                break;
            case 'Maybe.none':
                var $320 = Pair$new$(Mons$Object$void, 0);
                var $315 = $320;
                break;
        };
        return $315;
    };
    const Mons$Map$get_hero = x0 => x1 => Mons$Map$get_hero$(x0, x1);
    const Mons$Kind$const$CHEST = ({
        _: 'Mons.Kind.const.CHEST'
    });

    function Mons$Map$push$(_pos$1, _obj$2, _map$3) {
        var _objs$4 = Mons$Map$get_list$(_pos$1, _map$3);
        var _objs$5 = List$cons$(_obj$2, _objs$4);
        var $321 = Mons$Map$set_list$(_pos$1, _objs$5, _map$3);
        return $321;
    };
    const Mons$Map$push = x0 => x1 => x2 => Mons$Map$push$(x0, x1, x2);

    function Mons$Game$new$(_usr$1, _pos$2, _map$3, _stt$4, _tik$5) {
        var $322 = ({
            _: 'Mons.Game.new',
            'usr': _usr$1,
            'pos': _pos$2,
            'map': _map$3,
            'stt': _stt$4,
            'tik': _tik$5
        });
        return $322;
    };
    const Mons$Game$new = x0 => x1 => x2 => x3 => x4 => Mons$Game$new$(x0, x1, x2, x3, x4);

    function Mons$Game$set_map$(_map$1, _game$2) {
        var self = _game$2;
        switch (self._) {
            case 'Mons.Game.new':
                var $324 = self.usr;
                var $325 = self.pos;
                var $326 = self.stt;
                var $327 = self.tik;
                var $328 = Mons$Game$new$($324, $325, _map$1, $326, $327);
                var $323 = $328;
                break;
        };
        return $323;
    };
    const Mons$Game$set_map = x0 => x1 => Mons$Game$set_map$(x0, x1);

    function Mons$Game$map_push$(_pos$1, _obj$2, _game$3) {
        var self = _game$3;
        switch (self._) {
            case 'Mons.Game.new':
                var $330 = self.map;
                var _map$9 = Mons$Map$push$(_pos$1, _obj$2, $330);
                var $331 = Mons$Game$set_map$(_map$9, _game$3);
                var $329 = $331;
                break;
        };
        return $329;
    };
    const Mons$Game$map_push = x0 => x1 => x2 => Mons$Game$map_push$(x0, x1, x2);

    function Mons$Object$get_adjacent_pos$(_pos$1, _dir$2, _map$3) {
        var _x$4 = ((_pos$1 & 0xFFF));
        var _y$5 = (((_pos$1 >>> 12) & 0xFFF));
        var _z$6 = ((_pos$1 >>> 24));
        var self = _dir$2;
        switch (self._) {
            case 'Mons.Dir.right':
                var $333 = ((0 | ((_x$4 + 1) >>> 0) | (_y$5 << 12) | (_z$6 << 24)));
                var $332 = $333;
                break;
            case 'Mons.Dir.up':
                var $334 = ((0 | _x$4 | ((Math.max(_y$5 - 1, 0)) << 12) | (_z$6 << 24)));
                var $332 = $334;
                break;
            case 'Mons.Dir.left':
                var $335 = ((0 | (Math.max(_x$4 - 1, 0)) | (_y$5 << 12) | (_z$6 << 24)));
                var $332 = $335;
                break;
            case 'Mons.Dir.down':
                var $336 = ((0 | _x$4 | (((_y$5 + 1) >>> 0) << 12) | (_z$6 << 24)));
                var $332 = $336;
                break;
        };
        return $332;
    };
    const Mons$Object$get_adjacent_pos = x0 => x1 => x2 => Mons$Object$get_adjacent_pos$(x0, x1, x2);

    function Mons$Game$get_tile$(_pos$1, _game$2) {
        var self = _game$2;
        switch (self._) {
            case 'Mons.Game.new':
                var $338 = self.map;
                var $339 = Mons$Map$get_list$(_pos$1, $338);
                var $337 = $339;
                break;
        };
        return $337;
    };
    const Mons$Game$get_tile = x0 => x1 => Mons$Game$get_tile$(x0, x1);

    function Mons$Object$get_adjacent_obj_list$(_pos$1, _dir$2, _game$3) {
        var self = _game$3;
        switch (self._) {
            case 'Mons.Game.new':
                var $341 = self.map;
                var _adjacent_pos$9 = Mons$Object$get_adjacent_pos$(_pos$1, _dir$2, $341);
                var $342 = Mons$Game$get_tile$(_adjacent_pos$9, _game$3);
                var $340 = $342;
                break;
        };
        return $340;
    };
    const Mons$Object$get_adjacent_obj_list = x0 => x1 => x2 => Mons$Object$get_adjacent_obj_list$(x0, x1, x2);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const List$length = a0 => (list_length(a0));

    function Mons$Object$can_move_forward$(_pos$1, _dir$2, _game$3) {
        var self = _game$3;
        switch (self._) {
            case 'Mons.Game.new':
                var _adjacent_objs$9 = Mons$Object$get_adjacent_obj_list$(_pos$1, _dir$2, _game$3);
                var $344 = ((list_length(_adjacent_objs$9)) === 1n);
                var $343 = $344;
                break;
        };
        return $343;
    };
    const Mons$Object$can_move_forward = x0 => x1 => x2 => Mons$Object$can_move_forward$(x0, x1, x2);

    function List$tail$(_xs$2) {
        var self = _xs$2;
        switch (self._) {
            case 'List.cons':
                var $346 = self.tail;
                var $347 = $346;
                var $345 = $347;
                break;
            case 'List.nil':
                var $348 = List$nil;
                var $345 = $348;
                break;
        };
        return $345;
    };
    const List$tail = x0 => List$tail$(x0);

    function List$delete_at_u32$(_idx$2, _list$3) {
        var self = (_idx$2 === 0);
        if (self) {
            var $350 = List$tail$(_list$3);
            var $349 = $350;
        } else {
            var self = _list$3;
            switch (self._) {
                case 'List.cons':
                    var $352 = self.head;
                    var $353 = self.tail;
                    var $354 = List$cons$($352, List$delete_at_u32$((Math.max(_idx$2 - 1, 0)), $353));
                    var $351 = $354;
                    break;
                case 'List.nil':
                    var $355 = _list$3;
                    var $351 = $355;
                    break;
            };
            var $349 = $351;
        };
        return $349;
    };
    const List$delete_at_u32 = x0 => x1 => List$delete_at_u32$(x0, x1);

    function Mons$Map$del$(_pos$1, _idx$2, _map$3) {
        var _objs$4 = Mons$Map$get_list$(_pos$1, _map$3);
        var _objs$5 = List$delete_at_u32$(_idx$2, _objs$4);
        var $356 = Mons$Map$set_list$(_pos$1, _objs$5, _map$3);
        return $356;
    };
    const Mons$Map$del = x0 => x1 => x2 => Mons$Map$del$(x0, x1, x2);

    function Mons$Game$map_del$(_pos$1, _idx$2, _game$3) {
        var self = _game$3;
        switch (self._) {
            case 'Mons.Game.new':
                var $358 = self.map;
                var _map$9 = Mons$Map$del$(_pos$1, _idx$2, $358);
                var $359 = Mons$Game$set_map$(_map$9, _game$3);
                var $357 = $359;
                break;
        };
        return $357;
    };
    const Mons$Game$map_del = x0 => x1 => x2 => Mons$Game$map_del$(x0, x1, x2);

    function Mons$Object$heal_all_mons$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $361 = _obj$1;
                var $360 = $361;
                break;
        };
        return $360;
    };
    const Mons$Object$heal_all_mons = x0 => Mons$Object$heal_all_mons$(x0);

    function List$update_at$(_index$2, _fn$3, _list$4) {
        var self = _list$4;
        switch (self._) {
            case 'List.cons':
                var $363 = self.head;
                var $364 = self.tail;
                var self = _index$2;
                if (self === 0n) {
                    var $366 = List$cons$(_fn$3($363), $364);
                    var $365 = $366;
                } else {
                    var $367 = (self - 1n);
                    var $368 = List$cons$($363, List$update_at$($367, _fn$3, $364));
                    var $365 = $368;
                };
                var $362 = $365;
                break;
            case 'List.nil':
                var $369 = List$nil;
                var $362 = $369;
                break;
        };
        return $362;
    };
    const List$update_at = x0 => x1 => x2 => List$update_at$(x0, x1, x2);

    function Mons$Map$set$(_pos$1, _idx$2, _val$3, _map$4) {
        var _list$5 = Mons$Map$get_list$(_pos$1, _map$4);
        var _list$6 = List$update_at$(U32$to_nat$(_idx$2), (_$6 => {
            var $371 = _val$3;
            return $371;
        }), _list$5);
        var $370 = Mons$Map$set_list$(_pos$1, _list$6, _map$4);
        return $370;
    };
    const Mons$Map$set = x0 => x1 => x2 => x3 => Mons$Map$set$(x0, x1, x2, x3);

    function Mons$Game$map_set$(_pos$1, _idx$2, _obj$3, _game$4) {
        var self = _game$4;
        switch (self._) {
            case 'Mons.Game.new':
                var $373 = self.map;
                var _map$10 = Mons$Map$set$(_pos$1, _idx$2, _obj$3, $373);
                var $374 = Mons$Game$set_map$(_map$10, _game$4);
                var $372 = $374;
                break;
        };
        return $372;
    };
    const Mons$Game$map_set = x0 => x1 => x2 => x3 => Mons$Game$map_set$(x0, x1, x2, x3);

    function Mons$Kind$inter_lever_eff$(_kind$1, _on$2, _game$3) {
        var self = Mons$Game$get_hero_pos$(_game$3);
        switch (self._) {
            case 'Maybe.some':
                var $376 = self.value;
                var _hero_pos$5 = $376;
                var _x$6 = ((_hero_pos$5 & 0xFFF));
                var _y$7 = (((_hero_pos$5 >>> 12) & 0xFFF));
                var _z$8 = ((_hero_pos$5 >>> 24));
                var self = _game$3;
                switch (self._) {
                    case 'Mons.Game.new':
                        var $378 = self.map;
                        var _map$14 = $378;
                        var _hero_pair$15 = Mons$Map$get_hero$(_hero_pos$5, _map$14);
                        var _hero_obj$16 = Pair$fst$(_hero_pair$15);
                        var _hero_idx$17 = Pair$snd$(_hero_pair$15);
                        var _obj_idx$18 = 0;
                        var self = _hero_obj$16;
                        switch (self._) {
                            case 'Mons.Object.new':
                                var $380 = self.dir;
                                var self = _kind$1;
                                switch (self._) {
                                    case 'Mons.Kind.inter.LEVER':
                                        var $382 = self.id;
                                        var self = (_z$8 === 1);
                                        if (self) {
                                            var self = ($382 === 0);
                                            if (self) {
                                                var _sign$31 = Mons$Kind$new_const$(Mons$Kind$const$CHEST);
                                                var _obj_pos$32 = ((0 | ((1 + _x$6) >>> 0) | ((Math.max(_y$7 - 1, 0)) << 12) | (_z$8 << 24)));
                                                var $385 = Mons$Game$map_push$(_obj_pos$32, _sign$31, _game$3);
                                                var $384 = $385;
                                            } else {
                                                var $386 = _game$3;
                                                var $384 = $386;
                                            };
                                            var $383 = $384;
                                        } else {
                                            var $387 = _game$3;
                                            var $383 = $387;
                                        };
                                        var $381 = $383;
                                        break;
                                    case 'Mons.Kind.inter.MOVE':
                                        var _movable_obj_pos$30 = Mons$Object$get_adjacent_pos$(_hero_pos$5, $380, _map$14);
                                        var self = Mons$Object$can_move_forward$(_movable_obj_pos$30, $380, _game$3);
                                        if (self) {
                                            var _obj$31 = Mons$Kind$new_interactive_tool$(_kind$1, Bool$true, Mons$Kind$inter_lever_eff);
                                            var _new_pos$32 = Mons$Object$get_adjacent_pos$(_movable_obj_pos$30, $380, _map$14);
                                            var _game$33 = Mons$Game$map_del$(_movable_obj_pos$30, _obj_idx$18, _game$3);
                                            var $389 = Mons$Game$map_push$(_new_pos$32, _obj$31, _game$33);
                                            var $388 = $389;
                                        } else {
                                            var $390 = _game$3;
                                            var $388 = $390;
                                        };
                                        var $381 = $388;
                                        break;
                                    case 'Mons.Kind.inter.HEAL':
                                        var self = _on$2;
                                        if (self) {
                                            var $392 = _game$3;
                                            var $391 = $392;
                                        } else {
                                            var _hero_obj$30 = Mons$Object$heal_all_mons$(_hero_obj$16);
                                            var $393 = Mons$Game$map_set$(_hero_pos$5, _hero_idx$17, _hero_obj$30, _game$3);
                                            var $391 = $393;
                                        };
                                        var $381 = $391;
                                        break;
                                };
                                var $379 = $381;
                                break;
                        };
                        var $377 = $379;
                        break;
                };
                var $375 = $377;
                break;
            case 'Maybe.none':
                var $394 = _game$3;
                var $375 = $394;
                break;
        };
        return $375;
    };
    const Mons$Kind$inter_lever_eff = x0 => x1 => x2 => Mons$Kind$inter_lever_eff$(x0, x1, x2);

    function Mons$Kind$inter$LEVER$(_id$1) {
        var $395 = ({
            _: 'Mons.Kind.inter.LEVER',
            'id': _id$1
        });
        return $395;
    };
    const Mons$Kind$inter$LEVER = x0 => Mons$Kind$inter$LEVER$(x0);
    const Mons$Kind$terrain$GRASS_PLANT = ({
        _: 'Mons.Kind.terrain.GRASS_PLANT'
    });
    const Mons$Kind$terrain$PLANT_0 = ({
        _: 'Mons.Kind.terrain.PLANT_0'
    });

    function Mons$Map$code_to_tile$(_code$1, _dim$2) {
        var self = (_dim$2 === 0);
        if (self) {
            var _path_brick$3 = Mons$Kind$new_terrain$(Mons$Kind$terrain$FLOOR$(0, 0));
            var _lvl0$4 = 0;
            var _path_blocker$5 = Mons$Kind$new_terrain$(Mons$Kind$terrain$PATH_BLOCKER$(_lvl0$4, 0));
            var $397 = Mons$Map$code_to_tile$aux$(_code$1, List$cons$(Pair$new$("mg", Mons$Kind$new_mons$(Mons$Kind$mons$MAGE, Mons$Type$normal, 2)), List$cons$(Pair$new$("ct", List$cons$(Mons$Kind$new_const$(Mons$Kind$const$CRYSTAL), List$nil)), List$cons$(Pair$new$("ft", List$cons$(Mons$Kind$new_const$(Mons$Kind$const$FOUNTAIN$(_lvl0$4, 0)), List$cons$(_path_brick$3, List$nil))), List$cons$(Pair$new$("pt", List$cons$(Mons$Kind$new_const$(Mons$Kind$const$PORTAL), List$nil)), List$cons$(Pair$new$(".g", List$cons$(_path_brick$3, List$nil)), List$cons$(Pair$new$("bb", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$VOID_BLACK), List$nil)), List$cons$(Pair$new$("xx", List$cons$(_path_blocker$5, List$nil)), List$cons$(Pair$new$("c1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(0, 1)), List$nil)), List$cons$(Pair$new$("c2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(0, 2)), List$nil)), List$cons$(Pair$new$("c3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(0, 3)), List$nil)), List$cons$(Pair$new$("c4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(0, 4)), List$nil)), List$cons$(Pair$new$("c5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(0, 5)), List$nil)), List$cons$(Pair$new$("d1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(1, 1)), List$nil)), List$cons$(Pair$new$("d2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(1, 2)), List$nil)), List$cons$(Pair$new$("d3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(1, 3)), List$nil)), List$cons$(Pair$new$("d4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(1, 4)), List$nil)), List$cons$(Pair$new$("d5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(1, 5)), List$nil)), List$cons$(Pair$new$("e1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(2, 1)), List$nil)), List$cons$(Pair$new$("e2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(2, 2)), List$nil)), List$cons$(Pair$new$("e3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(2, 3)), List$nil)), List$cons$(Pair$new$("e4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(2, 4)), List$nil)), List$cons$(Pair$new$("e5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(2, 5)), List$nil)), List$cons$(Pair$new$("f1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(3, 1)), List$nil)), List$cons$(Pair$new$("f2", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(3, 2)), List$nil))), List$cons$(Pair$new$("f3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(3, 3)), List$nil)), List$cons$(Pair$new$("f4", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(3, 4)), List$nil))), List$cons$(Pair$new$("f5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(3, 5)), List$nil)), List$cons$(Pair$new$("g1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(4, 1)), List$nil)), List$cons$(Pair$new$("g2", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(4, 2)), List$nil))), List$cons$(Pair$new$("g3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(4, 3)), List$nil)), List$cons$(Pair$new$("g4", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(4, 4)), List$nil))), List$cons$(Pair$new$("g5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(4, 5)), List$nil)), List$cons$(Pair$new$("a1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(5, 1)), List$nil)), List$cons$(Pair$new$("a2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(5, 2)), List$nil)), List$cons$(Pair$new$("a3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(5, 3)), List$nil)), List$cons$(Pair$new$("a4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(5, 4)), List$nil)), List$cons$(Pair$new$("a5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(5, 5)), List$nil)), List$cons$(Pair$new$("b1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(6, 1)), List$nil)), List$cons$(Pair$new$("b2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(6, 2)), List$nil)), List$cons$(Pair$new$("b3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(6, 3)), List$nil)), List$cons$(Pair$new$("b4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(6, 4)), List$nil)), List$cons$(Pair$new$("b5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(6, 5)), List$nil)), List$cons$(Pair$new$("h1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(7, 1)), List$nil)), List$cons$(Pair$new$("h2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(7, 2)), List$nil)), List$cons$(Pair$new$("h3", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(7, 3)), List$nil))), List$cons$(Pair$new$("h4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(7, 4)), List$nil)), List$cons$(Pair$new$("h5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(7, 5)), List$nil)), List$cons$(Pair$new$("i1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(8, 1)), List$nil)), List$cons$(Pair$new$("i2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(8, 2)), List$nil)), List$cons$(Pair$new$("i3", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(8, 3)), List$cons$(Mons$Kind$new_const$(Mons$Kind$const$FOUNTAIN$(_lvl0$4, 0)), List$nil)))), List$cons$(Pair$new$("i4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(8, 4)), List$nil)), List$cons$(Pair$new$("i5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(8, 5)), List$nil)), List$cons$(Pair$new$("j1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(9, 1)), List$nil)), List$cons$(Pair$new$("j2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(9, 2)), List$nil)), List$cons$(Pair$new$("j3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(9, 3)), List$nil)), List$cons$(Pair$new$("j4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(9, 4)), List$nil)), List$cons$(Pair$new$("j5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(9, 5)), List$nil)), List$cons$(Pair$new$("k1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(10, 1)), List$nil)), List$cons$(Pair$new$("k2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(10, 2)), List$nil)), List$cons$(Pair$new$("k3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(10, 3)), List$nil)), List$cons$(Pair$new$("k4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(10, 4)), List$nil)), List$cons$(Pair$new$("k5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(10, 5)), List$nil)), List$cons$(Pair$new$("l1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(11, 1)), List$nil)), List$cons$(Pair$new$("l2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(11, 2)), List$nil)), List$cons$(Pair$new$("l3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(11, 3)), List$nil)), List$cons$(Pair$new$("l4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(11, 4)), List$nil)), List$cons$(Pair$new$("l5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(11, 5)), List$nil)), List$cons$(Pair$new$("m1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(12, 1)), List$nil)), List$cons$(Pair$new$("m2", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(12, 2)), List$nil))), List$cons$(Pair$new$("m3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(12, 3)), List$nil)), List$cons$(Pair$new$("m4", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(12, 4)), List$nil))), List$cons$(Pair$new$("m5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(12, 5)), List$nil)), List$cons$(Pair$new$("n1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(13, 1)), List$nil)), List$cons$(Pair$new$("n2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(13, 2)), List$nil)), List$cons$(Pair$new$("n3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(13, 3)), List$nil)), List$cons$(Pair$new$("n4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(13, 4)), List$nil)), List$cons$(Pair$new$("n5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(13, 5)), List$nil)), List$cons$(Pair$new$("o1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(14, 1)), List$nil)), List$cons$(Pair$new$("o2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(14, 2)), List$nil)), List$cons$(Pair$new$("o3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(14, 3)), List$nil)), List$cons$(Pair$new$("o4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(14, 4)), List$nil)), List$cons$(Pair$new$("o5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(14, 5)), List$nil)), List$cons$(Pair$new$("p1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(15, 1)), List$nil)), List$cons$(Pair$new$("p2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(15, 2)), List$nil)), List$cons$(Pair$new$("p3", List$cons$(_path_blocker$5, List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(15, 3)), List$nil))), List$cons$(Pair$new$("p4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(15, 4)), List$nil)), List$cons$(Pair$new$("p5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(15, 5)), List$nil)), List$cons$(Pair$new$("q1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(16, 1)), List$nil)), List$cons$(Pair$new$("q2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(16, 2)), List$nil)), List$cons$(Pair$new$("q3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(16, 3)), List$nil)), List$cons$(Pair$new$("q4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(16, 4)), List$nil)), List$cons$(Pair$new$("q5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(16, 5)), List$nil)), List$cons$(Pair$new$("r1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(17, 1)), List$nil)), List$cons$(Pair$new$("r2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(17, 2)), List$nil)), List$cons$(Pair$new$("r3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(17, 3)), List$nil)), List$cons$(Pair$new$("r4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(17, 4)), List$nil)), List$cons$(Pair$new$("r5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(17, 5)), List$nil)), List$cons$(Pair$new$("s1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(18, 1)), List$nil)), List$cons$(Pair$new$("s2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(18, 2)), List$nil)), List$cons$(Pair$new$("s3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(18, 3)), List$nil)), List$cons$(Pair$new$("s4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(18, 4)), List$nil)), List$cons$(Pair$new$("s5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(18, 5)), List$nil)), List$cons$(Pair$new$("t1", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(19, 1)), List$nil)), List$cons$(Pair$new$("t2", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(19, 2)), List$nil)), List$cons$(Pair$new$("t3", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(19, 3)), List$nil)), List$cons$(Pair$new$("t4", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(19, 4)), List$nil)), List$cons$(Pair$new$("t5", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$MID_CITY$(19, 5)), List$nil)), List$cons$(Pair$new$("fg", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(0, 0)), List$nil)), List$cons$(Pair$new$("mc", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(38, 0)), List$nil)), List$cons$(Pair$new$("mf", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(38, 1)), List$nil)), List$cons$(Pair$new$("lc", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(37, 0)), List$nil)), List$cons$(Pair$new$("lf", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(37, 1)), List$nil)), List$cons$(Pair$new$("kc", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(36, 0)), List$nil)), List$cons$(Pair$new$("kf", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(36, 1)), List$nil)), List$cons$(Pair$new$("jc", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(35, 0)), List$nil)), List$cons$(Pair$new$("jf", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(35, 1)), List$nil)), List$cons$(Pair$new$("ic", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(34, 0)), List$nil)), List$cons$(Pair$new$("if", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$STAIRS$(34, 1)), List$nil)), List$nil)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
            var $396 = $397;
        } else {
            var self = (_dim$2 === 1);
            if (self) {
                var _floor$3 = Mons$Kind$new_terrain$(Mons$Kind$terrain$FLOOR$(1, 0));
                var $399 = Mons$Map$code_to_tile$aux$(_code$1, List$cons$(Pair$new$("ft", List$cons$(Mons$Kind$new_const$(Mons$Kind$const$FOUNTAIN$(1, 0)), List$nil)), List$cons$(Pair$new$("pt", List$cons$(Mons$Kind$new_const$(Mons$Kind$const$PORTAL), List$nil)), List$cons$(Pair$new$("hl", List$cons$(Mons$Kind$new_interactive_tool$(Mons$Kind$inter$HEAL, Bool$false, Mons$Kind$inter_lever_eff), List$cons$(_floor$3, List$nil))), List$cons$(Pair$new$("al", List$cons$(Mons$Kind$new_interactive_tool$(Mons$Kind$inter$LEVER$(0), Bool$false, Mons$Kind$inter_lever_eff), List$nil)), List$cons$(Pair$new$(".g", List$cons$(_floor$3, List$nil)), List$cons$(Pair$new$(".d", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$GRASS_PLANT), List$nil)), List$cons$(Pair$new$("xx", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$PATH_BLOCKER$(1, 0)), List$nil)), List$cons$(Pair$new$("pg", List$cons$(Mons$Kind$new_terrain$(Mons$Kind$terrain$PLANT_0), List$cons$(_floor$3, List$nil))), List$nil)))))))));
                var $398 = $399;
            } else {
                var self = (_dim$2 === 2);
                if (self) {
                    var _floor$3 = Mons$Kind$new_terrain$(Mons$Kind$terrain$FLOOR$(2, 0));
                    var $401 = Mons$Map$code_to_tile$aux$(_code$1, List$cons$(Pair$new$(".g", List$cons$(_floor$3, List$nil)), List$cons$(Pair$new$("pt", List$cons$(Mons$Kind$new_const$(Mons$Kind$const$PORTAL), List$nil)), List$nil)));
                    var $400 = $401;
                } else {
                    var _path_brick$3 = Mons$Kind$new_terrain$(Mons$Kind$terrain$FLOOR$(1, 0));
                    var $402 = Mons$Map$code_to_tile$aux$(_code$1, List$cons$(Pair$new$(".g", List$cons$(_path_brick$3, List$nil)), List$nil));
                    var $400 = $402;
                };
                var $398 = $400;
            };
            var $396 = $398;
        };
        return $396;
    };
    const Mons$Map$code_to_tile = x0 => x1 => Mons$Map$code_to_tile$(x0, x1);

    function Mons$Map$build$(_code$1) {
        var $403 = List$ifor_u32$(_code$1, Mons$Map$new, (_z$2 => _plane$3 => _map$4 => {
            var _size$5 = List$length_u32$(_plane$3);
            var $404 = List$ifor_u32$(_plane$3, _map$4, (_j$6 => _row$7 => _map$8 => {
                var _map$9 = (() => {
                    var $406 = _map$8;
                    var $407 = 0;
                    var $408 = _size$5;
                    let _map$10 = $406;
                    for (let _i$9 = $407; _i$9 < $408; ++_i$9) {
                        var _t_x$11 = (((Math.max(2048 - ((_size$5 / 2) >>> 0), 0)) + _i$9) >>> 0);
                        var _t_y$12 = (((Math.max(2048 - ((_size$5 / 2) >>> 0), 0)) + _j$6) >>> 0);
                        var _t_z$13 = _z$2;
                        var _pos$14 = ((0 | _t_x$11 | (_t_y$12 << 12) | (_t_z$13 << 24)));
                        var _ini$15 = U32$to_nat$(((_i$9 * 2) >>> 0));
                        var _end$16 = U32$to_nat$(((((_i$9 * 2) >>> 0) + 2) >>> 0));
                        var _sli$17 = String$slice$(_ini$15, _end$16, _row$7);
                        var $406 = Mons$Map$set_list$(_pos$14, Mons$Map$code_to_tile$(_sli$17, _z$2), _map$10);
                        _map$10 = $406;
                    };
                    return _map$10;
                })();
                var $405 = _map$9;
                return $405;
            }));
            return $404;
        }));
        return $403;
    };
    const Mons$Map$build = x0 => Mons$Map$build$(x0);
    const Mons$map_source = List$cons$(List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbptbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbecbbxx.g.gfg.g.gxxbbefbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbfcbbxx.g.gfg.g.gxxbbffbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbgcbbxx.g.gfg.g.gxxbbgfbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhcxx.g.gfg.g.gxxhfbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbicxx.g.gfg.g.gxxifbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbjcxx.g.gfg.g.gxxjfbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbkcxx.g.gfg.g.gxxkfbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbblcxx.g.gfg.g.gxxlfbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbmcxx.g.gfg.g.gxxmfbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbc0bbbbbbbbc1bbbbbbbbc2bbxx.g.gc3.g.gxxbbc4bbbbbbbbc5bbbbbbbbc6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbd0bbbbbbbbd1bbbbbbbbd2bbxx.g.gd3.g.gxxbbd4bbbbbbbbd5bbbbbbbbd6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbe0bbbbbbbbe1bbbbbbbbe2bbxx.g.ge3.g.gxxbbe4bbbbbbbbe5bbbbbbbbe6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbf0bbbbbbbbf1bbbbbbxxf2xx.g.g.gf3.g.g.gxxf4xxbbbbbbf5bbbbbbbbf6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbg0bbbbbbbbg1bbbbbbxxg2.g.g.g.gg3.g.g.g.gg4xxbbbbbbg5bbbbbbbbg6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbba0bbbbbbbba1bbbbbbxxa2.g.g.g.ga3.g.g.g.ga4xxbbbbbba5bbbbbbbba6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb0bbbbbbbbb1bbbbbbxxb2.g.g.g.gb3.g.g.g.gb4xxbbbbbbb5bbbbbbbbb6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbh0bbbbbbbbh1bbbbbbxxh2.g.g.g.gh3.g.g.g.gh4xxbbbbbbh5bbbbbbbbh6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbi0bbbbbbbbi1bbbbbbxxi2.g.g.gxxi3xx.g.g.gi4xxbbbbbbi5bbbbbbbbi6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbj0bbbbbbbbj1bbbbbbxxj2.g.g.g.gj3mg.g.g.gj4xxbbbbbbj5bbbbbbbbj6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbk0bbbbbbbbk1bbbbbbxxk2.g.g.g.gk3.g.g.g.gk4xxbbbbbbk5bbbbbbbbk6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbl0bbbbbbbbl1bbbbbbxxl2.g.g.g.gl3.g.g.g.gl4xxbbbbbbl5bbbbbbbbl6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbm0bbbbbbbbm1bbbbbbxxm2.g.g.g.gm3.g.gxxxxm4xxbbbbbbm5bbbbbbbbm6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbn0bbbbbbbbn1bbbbbbbbn2xx.g.g.gn3.g.gxxxxn4bbbbbbbbn5bbbbbbbbn6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbo0bbbbbbbbo1bbbbbbbbo2xx.g.g.go3.g.gxxbbo4bbbbbbbbo5bbbbbbbbo6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbp0bbbbbbbbp1bbbbbbbbp2xxxxxxxxp3xxxxxxbbp4bbbbbbbbp4bbbbbbbbp6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbq0bbbbbbbbq1bbbbbbbbq2xxbbbbbbq3bbbbxxbbq4bbbbbbbbq5bbbbbbbbq6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbr0bbbbbbbbr1bbbbbbbbr2bbxxbbbbr3bbbbxxbbr4bbbbbbbbr5bbbbbbbbr6bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbs1bbbbbbbbs2bbxxbbbbs3bbbbxxbbs4bbbbbbbbs5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbt1bbbbbbbbt2bbxxbbbbt3bbbbxxbbt4bbbbbbbbt5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbu1bbbbbbbbu2bbxxbbbbu3bbbbxxbbu4bbbbbbbbu5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbv1bbbbbbbbv2bbxxbbbbv3bbbbxxbbv4bbbbbbbbv5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbw1bbbbbbbbw2bbxxxxxxw3xxxxxxbbw4bbbbbbbbw5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbx1bbbbbbbbx2bbbbbbbbx3bbbbbbbbx4bbbbbbbbx5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbby1bbbbbbbby2bbbbbbbby3bbbbbbbby4bbbbbbbby5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbz1bbbbbbbbz2bbbbbbbbz3bbbbbbbbz4bbbbbbbbz5bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbacbbbbbbbbadbbbbbbbbaebbbbbbbbafbbbbbbbbagbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbcbbbbbbbbbdbbbbbbbbbebbbbbbbbbfbbbbbbbbbgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbccbbbbbbbbcdbbbbbbbbcebbbbbbbbcfbbbbbbbbcgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbdcbbbbbbbbddbbbbbbbbdebbbbbbbbdfbbbbbbbbdgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbegbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbfgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbggbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbhgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbigbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbjgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbkgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbblgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbmgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$nil)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))), List$cons$(List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpg.g.g.g.gpgpgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbpgpg.g.gpt.g.g.gpgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.gpgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpg.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.ghl.g.g.g.g.g.gpgpgpg.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gpgpg.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gpgpg.g.g.g.g.g.g.g.g.g.g.gpgpg.g.g.g.g.gpgpg.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.gpgbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbpg.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgpgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.gpopopopopopopo.g.g.g.g.gbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.gpopopopopopopo.g.g.g.g.gbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.gpopopopopopopo.g.g.g.g.gbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbememememememem.g.g.g.g.g.gpgpgbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.gpopopopopopopo.g.g.g.g.gbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbpgememememememem.g.g.g.g.g.gpgpgpgbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbpgpgpgpgpgpopopopopopopopgpgpgpgpgbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbpgememememememem.g.g.g.g.g.g.gpgpgbbbbbbbbbbbb.g.g.gmimimimimimimi.g.g.gpg.g.gbbbbbbpgpgpgpgpgpopopopopopopopgpgpgpgpgbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbpgpgememememememem.g.g.g.g.g.g.g.g.g.gbbbbbbbbbb.g.g.gmimimimimimimi.g.g.g.g.g.gbbbbbb.g.g.g.g.gpopopopopopopo.g.g.g.g.gbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbpgpgememememememem.g.g.g.g.g.g.g.g.g.g.ghl.g.g.g.g.g.gmimimimimimimi.g.g.g.g.g.gbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbpgpgemememememememenenenenenenen.g.g.g.g.g.g.g.g.g.g.gmimimimimimimi.g.g.gpgpg.gbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbpgpgemememememememenenenenenenen.g.g.g.g.g.g.g.g.g.g.gmimimimimimimi.g.g.gpgpg.gbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbpgpg.g.g.g.g.g.g.genenenenenenen.g.g.gbbbbbbbbbb.g.g.gmimimimimimimi.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbpgpgpgpg.g.g.g.g.genenenenenenenpgpgbbbbbbbbbbbb.g.g.gmimimimimimimi.g.g.gpgpg.gbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbpgpgpgpg.g.g.g.genenenenenenenpgpgbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.gpgpg.gbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbpgpgpgpgpg.g.g.genenenenenenenpgbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.gpg.g.g.g.g.gbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgpg.g.g.genenenenenenenbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbb.g.gmimimimimimimi.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbb.g.gmimimimimimimi.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbb.g.gmimimimimimimi.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgpgpgpgpg.gpgpgpgpgpgpgpgpgpgpgpg.g.g.g.gpgpgbbbbbbbbbbbb.g.gmimimimimimimi.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpg.g.g.g.g.g.gbbbbbbbbpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpg.g.g.g.gpgpgbbbbbbbbbbbb.g.gmimimimimimimi.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgtrtrtrtrtrtrtr.gbbbbbb.gpgpgpgpgpgpgpgpgpgpgpg.gpgpgpgazazazazazazaz.gbbbbbbbbbbbb.g.gmimimimimimimi.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgtrtrtrtrtrtrtr.gbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gazazazazazazaz.gbbbbbbbbbbbb.g.gmimimimimimimi.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gtrtrtrtrtrtrtr.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gazazazazazazaz.gbbbbbbbbbbbb.g.g.gpg.g.g.gpg.g.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gtrtrtrtrtrtrtr.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gazazazazazazaz.gbbbbbbbbbbbb.g.g.gpg.g.g.gpg.g.g.gbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gtrtrtrtrtrtrtr.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gazazazazazazaz.gbbbbbbbbbbbbbb.g.gpg.g.g.gpg.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gtrtrtrtrtrtrtr.gbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gazazazazazazaz.gbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gtrtrtrtrtrtrtrpgbbbbbb.g.g.g.gpgpgpgpgpg.gpgpgpgpgpgpgazazazazazazaz.gbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.gpgpgpgbbbbbb.gpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpg.g.g.g.g.gbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.gpgpgbbbbbbbbpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpgpg.g.gpgpgpgbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbpgpgpgpg.gpgpgpgpgpgpgpg.g.g.gpgpgpg.g.g.gpgpgpgbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgcycycycycycycy.gbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgpgcycycycycycycy.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbpgpg.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpg.gcycycycycycycy.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbpgpg.gzozozozozozozobbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gcycycycycycycy.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gzozozozozozozo.gbbbbbbbbbbbbbbbbbbbbbbbb.g.g.gcycycycycycycy.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gzozozozozozozo.g.g.g.gpgpgpg.g.g.g.ghl.g.g.g.gcycycycycycycy.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gzozozozozozozo.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gcycycycycycycy.g.gbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbpg.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbpgpg.gzozozozozozozo.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpgpg.g.g.g.g.g.g.gbbbbbbbbbbbbbbbb.g.g.gzozozozozozozopgpgbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbpgpg.g.g.g.g.g.gbbbbbbbbbbbbbbbbbb.g.g.gzozozozozozozo.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.gpg.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.gpg.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gpg.g.g.g.gpg.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.gpg.g.g.g.g.g.g.g.gpg.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.gpg.g.g.g.g.g.g.g.gpg.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gpg.g.g.g.gpg.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$cons$("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb.g.g.g.g.g.gbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", List$nil)))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))), List$cons$(List$cons$("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", List$cons$("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", List$cons$("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", List$cons$("xxxxxxxxxxxxxx.g.g.g.g.g.gxxxxxxxxxxxxxx", List$cons$("xxxxxxxxxx.g.g.g.g.g.g.g.g.g.gxxxxxxxxxx", List$cons$("xxxxxxxx.g.g.g.g.g.g.g.g.g.g.g.gxxxxxxxx", List$cons$("xxxxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxxxx", List$cons$("xxxxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxxxx", List$cons$("xxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxx", List$cons$("xxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxx", List$cons$("xxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxx", List$cons$("xxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxx", List$cons$("xxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxx", List$cons$("xxxxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxxxx", List$cons$("xxxxxx.g.g.g.g.g.g.g.g.g.g.g.g.g.gxxxxxx", List$cons$("xxxxxxxx.g.g.g.g.g.g.g.g.g.g.g.gxxxxxxxx", List$cons$("xxxxxxxxxx.g.g.g.g.g.g.g.g.g.gxxxxxxxxxx", List$cons$("xxxxxxxxxxxxxx.g.g.g.g.g.gxxxxxxxxxxxxxx", List$cons$("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", List$cons$("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", List$nil)))))))))))))))))))), List$nil)));

    function Mons$Screen$game$(_cmd$1, _turn$2) {
        var $409 = ({
            _: 'Mons.Screen.game',
            'cmd': _cmd$1,
            'turn': _turn$2
        });
        return $409;
    };
    const Mons$Screen$game = x0 => x1 => Mons$Screen$game$(x0, x1);

    function Mons$Turn$new$(_exec_hero$1, _hero_skill$2, _adve_skill$3, _play$4) {
        var $410 = ({
            _: 'Mons.Turn.new',
            'exec_hero': _exec_hero$1,
            'hero_skill': _hero_skill$2,
            'adve_skill': _adve_skill$3,
            'play': _play$4
        });
        return $410;
    };
    const Mons$Turn$new = x0 => x1 => x2 => x3 => Mons$Turn$new$(x0, x1, x2, x3);
    const Mons$Skill$none = ({
        _: 'Mons.Skill.none'
    });
    const Mons$Turn$empty = Mons$Turn$new$(Bool$false, Mons$Skill$none, Mons$Skill$none, 0);

    function App$Render$pix$(_pixs$1) {
        var $411 = ({
            _: 'App.Render.pix',
            'pixs': _pixs$1
        });
        return $411;
    };
    const App$Render$pix = x0 => App$Render$pix$(x0);

    function Image3D$set_length$(_length$1, _img$2) {
        var self = _img$2;
        switch (self._) {
            case 'Image3D.new':
                var $413 = self.capacity;
                var $414 = self.buffer;
                var $415 = Image3D$new$(_length$1, $413, $414);
                var $412 = $415;
                break;
        };
        return $412;
    };
    const Image3D$set_length = x0 => x1 => Image3D$set_length$(x0, x1);

    function Image3D$clear$(_img$1) {
        var $416 = Image3D$set_length$(0, _img$1);
        return $416;
    };
    const Image3D$clear = x0 => Image3D$clear$(x0);

    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $417 = self.head;
                        var $418 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $420 = Maybe$some$($417);
                            var $419 = $420;
                        } else {
                            var $421 = (self - 1n);
                            var $422 = List$at$($421, $418);
                            var $419 = $422;
                        };
                        return $419;
                    case 'List.nil':
                        var $423 = Maybe$none;
                        return $423;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Mons$Map$get$(_pos$1, _idx$2, _map$3) {
        var _list$4 = Mons$Map$get_list$(_pos$1, _map$3);
        var self = List$at$(U32$to_nat$(_idx$2), _list$4);
        switch (self._) {
            case 'Maybe.some':
                var $425 = self.value;
                var $426 = $425;
                var $424 = $426;
                break;
            case 'Maybe.none':
                var $427 = Mons$Object$void;
                var $424 = $427;
                break;
        };
        return $424;
    };
    const Mons$Map$get = x0 => x1 => x2 => Mons$Map$get$(x0, x1, x2);

    function Mons$Game$dim$(_game$1) {
        var self = Mons$Game$get_hero_pos$(_game$1);
        switch (self._) {
            case 'Maybe.some':
                var $429 = self.value;
                var $430 = (($429 >>> 24));
                var $428 = $430;
                break;
            case 'Maybe.none':
                var $431 = 0;
                var $428 = $431;
                break;
        };
        return $428;
    };
    const Mons$Game$dim = x0 => Mons$Game$dim$(x0);

    function Mons$Object$get_current_mon$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $433 = self.bag;
                var $434 = self.mon;
                var _idx$13 = U32$to_nat$($434);
                var self = List$at$(_idx$13, $433);
                switch (self._) {
                    case 'Maybe.some':
                        var $436 = self.value;
                        var $437 = $436;
                        var $435 = $437;
                        break;
                    case 'Maybe.none':
                        var $438 = _obj$1;
                        var $435 = $438;
                        break;
                };
                var $432 = $435;
                break;
        };
        return $432;
    };
    const Mons$Object$get_current_mon = x0 => Mons$Object$get_current_mon$(x0);
    const Mons$global_scr_mid = ((0 | 2048 | (2048 << 12) | (0 << 24)));

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $440 = Bool$false;
                var $439 = $440;
                break;
            case 'Cmp.gtn':
                var $441 = Bool$true;
                var $439 = $441;
                break;
        };
        return $439;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $442 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $442;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);
    const U32$gtn = a0 => a1 => (a0 > a1);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $444 = Bool$true;
                var $443 = $444;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $445 = Bool$false;
                var $443 = $445;
                break;
        };
        return $443;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$ltn$(_a$2, _b$3) {
        var $446 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $446;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);

    function Mons$image_to_global$(_width$1, _height$2, _x$3, _y$4, _lvl$5) {
        var _g_x$6 = ((Mons$global_scr_mid & 0xFFF));
        var _g_y$7 = (((Mons$global_scr_mid >>> 12) & 0xFFF));
        var _mid_width$8 = ((_width$1 / 2) >>> 0);
        var _mid_height$9 = ((_height$2 / 2) >>> 0);
        var _mid_x_diff$10 = (Math.max(_mid_width$8 - _x$3, 0));
        var _mid_y_diff$11 = (Math.max(_mid_height$9 - _y$4, 0));
        var self = (_x$3 > _mid_width$8);
        if (self) {
            var $448 = ((_g_x$6 + (Math.max(_x$3 - _mid_width$8, 0))) >>> 0);
            var _upd_g_x$12 = $448;
        } else {
            var self = (_x$3 < _mid_width$8);
            if (self) {
                var $450 = (Math.max(_g_x$6 - (Math.max(_mid_width$8 - _x$3, 0)), 0));
                var $449 = $450;
            } else {
                var $451 = _g_x$6;
                var $449 = $451;
            };
            var _upd_g_x$12 = $449;
        };
        var self = (_y$4 > _mid_height$9);
        if (self) {
            var $452 = ((_g_y$7 + (Math.max(_y$4 - _mid_height$9, 0))) >>> 0);
            var _upd_g_y$13 = $452;
        } else {
            var self = (_y$4 < _mid_height$9);
            if (self) {
                var $454 = (Math.max(_g_y$7 - (Math.max(_mid_height$9 - _y$4, 0)), 0));
                var $453 = $454;
            } else {
                var $455 = _g_y$7;
                var $453 = $455;
            };
            var _upd_g_y$13 = $453;
        };
        var $447 = ((0 | _upd_g_x$12 | (_upd_g_y$13 << 12) | (_lvl$5 << 24)));
        return $447;
    };
    const Mons$image_to_global = x0 => x1 => x2 => x3 => x4 => Mons$image_to_global$(x0, x1, x2, x3, x4);

    function Mons$Attr$new$(_blocks$1, _mhp$2, _atk$3, _name$4, _wlk$5, _idl$6, _pic$7, _battle_spr$8, _skills$9, _pos$10) {
        var $456 = ({
            _: 'Mons.Attr.new',
            'blocks': _blocks$1,
            'mhp': _mhp$2,
            'atk': _atk$3,
            'name': _name$4,
            'wlk': _wlk$5,
            'idl': _idl$6,
            'pic': _pic$7,
            'battle_spr': _battle_spr$8,
            'skills': _skills$9,
            'pos': _pos$10
        });
        return $456;
    };
    const Mons$Attr$new = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => Mons$Attr$new$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9);

    function Word$mod$(_a$2, _b$3) {
        var Word$mod$ = (_a$2, _b$3) => ({
            ctr: 'TCO',
            arg: [_a$2, _b$3]
        });
        var Word$mod = _a$2 => _b$3 => Word$mod$(_a$2, _b$3);
        var arg = [_a$2, _b$3];
        while (true) {
            let [_a$2, _b$3] = arg;
            var R = Word$mod$(_a$2, _b$3);
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U32$mod = a0 => a1 => (a0 % a1);

    function Mons$walk_char_pack$(_t_x$1, _t_y$2, _ani$3, _dir$4, _r_0$5, _u_0$6, _l_0$7, _d_0$8, _r_1$9, _u_1$10, _l_1$11, _d_1$12, _r_2$13, _u_2$14, _l_2$15, _d_2$16) {
        var self = (_ani$3 === 0);
        if (self) {
            var self = _dir$4;
            switch (self._) {
                case 'Mons.Dir.right':
                    var $459 = List$cons$(_r_0$5, List$nil);
                    var $458 = $459;
                    break;
                case 'Mons.Dir.up':
                    var $460 = List$cons$(_u_0$6, List$nil);
                    var $458 = $460;
                    break;
                case 'Mons.Dir.left':
                    var $461 = List$cons$(_l_0$7, List$nil);
                    var $458 = $461;
                    break;
                case 'Mons.Dir.down':
                    var $462 = List$cons$(_d_0$8, List$nil);
                    var $458 = $462;
                    break;
            };
            var $457 = $458;
        } else {
            var self = ((((_t_x$1 + _t_y$2) >>> 0) % 2) === 0);
            if (self) {
                var self = _dir$4;
                switch (self._) {
                    case 'Mons.Dir.right':
                        var $465 = List$cons$(_r_1$9, List$nil);
                        var $464 = $465;
                        break;
                    case 'Mons.Dir.up':
                        var $466 = List$cons$(_u_1$10, List$nil);
                        var $464 = $466;
                        break;
                    case 'Mons.Dir.left':
                        var $467 = List$cons$(_l_1$11, List$nil);
                        var $464 = $467;
                        break;
                    case 'Mons.Dir.down':
                        var $468 = List$cons$(_d_1$12, List$nil);
                        var $464 = $468;
                        break;
                };
                var $463 = $464;
            } else {
                var self = _dir$4;
                switch (self._) {
                    case 'Mons.Dir.right':
                        var $470 = List$cons$(_r_2$13, List$nil);
                        var $469 = $470;
                        break;
                    case 'Mons.Dir.up':
                        var $471 = List$cons$(_u_2$14, List$nil);
                        var $469 = $471;
                        break;
                    case 'Mons.Dir.left':
                        var $472 = List$cons$(_l_2$15, List$nil);
                        var $469 = $472;
                        break;
                    case 'Mons.Dir.down':
                        var $473 = List$cons$(_d_2$16, List$nil);
                        var $469 = $473;
                        break;
                };
                var $463 = $469;
            };
            var $457 = $463;
        };
        return $457;
    };
    const Mons$walk_char_pack = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => x9 => x10 => x11 => x12 => x13 => x14 => x15 => Mons$walk_char_pack$(x0, x1, x2, x3, x4, x5, x6, x7, x8, x9, x10, x11, x12, x13, x14, x15);
    const U32$length = a0 => (a0.length);
    const U32$slice = a0 => a1 => a2 => (a2.slice(a0, a1));
    const U32$read_base = a0 => a1 => (parseInt(a1, a0));

    function Image3D$parse_byte$(_idx$1, _voxdata$2) {
        var _chr$3 = (_voxdata$2.slice(((_idx$1 * 2) >>> 0), ((((_idx$1 * 2) >>> 0) + 2) >>> 0)));
        var $474 = (parseInt(_chr$3, 16));
        return $474;
    };
    const Image3D$parse_byte = x0 => x1 => Image3D$parse_byte$(x0, x1);
    const Col32$new = a0 => a1 => a2 => a3 => ((0 | a0 | (a1 << 8) | (a2 << 16) | (a3 << 24)));

    function Word$trim$(_new_size$2, _word$3) {
        var self = _new_size$2;
        if (self === 0n) {
            var $476 = Word$e;
            var $475 = $476;
        } else {
            var $477 = (self - 1n);
            var self = _word$3;
            switch (self._) {
                case 'Word.o':
                    var $479 = self.pred;
                    var $480 = Word$o$(Word$trim$($477, $479));
                    var $478 = $480;
                    break;
                case 'Word.i':
                    var $481 = self.pred;
                    var $482 = Word$i$(Word$trim$($477, $481));
                    var $478 = $482;
                    break;
                case 'Word.e':
                    var $483 = Word$o$(Word$trim$($477, Word$e));
                    var $478 = $483;
                    break;
            };
            var $475 = $478;
        };
        return $475;
    };
    const Word$trim = x0 => x1 => Word$trim$(x0, x1);
    const Unit$new = 1;

    function Array$extract_tip$(_arr$2) {
        var self = _arr$2;
        switch (self._) {
            case 'Array.tip':
                var $485 = self.value;
                var $486 = $485;
                var $484 = $486;
                break;
            case 'Array.tie':
                var $487 = Unit$new;
                var $484 = $487;
                break;
        };
        return $484;
    };
    const Array$extract_tip = x0 => Array$extract_tip$(x0);

    function Array$extract_tie$(_arr$3) {
        var self = _arr$3;
        switch (self._) {
            case 'Array.tie':
                var $489 = self.lft;
                var $490 = self.rgt;
                var $491 = Pair$new$($489, $490);
                var $488 = $491;
                break;
            case 'Array.tip':
                var $492 = Unit$new;
                var $488 = $492;
                break;
        };
        return $488;
    };
    const Array$extract_tie = x0 => Array$extract_tie$(x0);

    function Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6) {
        var Word$foldl$ = (_nil$3, _w0$4, _w1$5, _word$6) => ({
            ctr: 'TCO',
            arg: [_nil$3, _w0$4, _w1$5, _word$6]
        });
        var Word$foldl = _nil$3 => _w0$4 => _w1$5 => _word$6 => Word$foldl$(_nil$3, _w0$4, _w1$5, _word$6);
        var arg = [_nil$3, _w0$4, _w1$5, _word$6];
        while (true) {
            let [_nil$3, _w0$4, _w1$5, _word$6] = arg;
            var R = (() => {
                var self = _word$6;
                switch (self._) {
                    case 'Word.o':
                        var $493 = self.pred;
                        var $494 = Word$foldl$(_w0$4(_nil$3), _w0$4, _w1$5, $493);
                        return $494;
                    case 'Word.i':
                        var $495 = self.pred;
                        var $496 = Word$foldl$(_w1$5(_nil$3), _w0$4, _w1$5, $495);
                        return $496;
                    case 'Word.e':
                        var $497 = _nil$3;
                        return $497;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$foldl = x0 => x1 => x2 => x3 => Word$foldl$(x0, x1, x2, x3);

    function Array$mut$(_idx$3, _f$4, _arr$5) {
        var $498 = Word$foldl$((_arr$6 => {
            var $499 = Array$tip$(_f$4(Array$extract_tip$(_arr$6)));
            return $499;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $501 = self.fst;
                    var $502 = self.snd;
                    var $503 = Array$tie$(_rec$7($501), $502);
                    var $500 = $503;
                    break;
            };
            return $500;
        }), (_rec$7 => _arr$8 => {
            var self = Array$extract_tie$(_arr$8);
            switch (self._) {
                case 'Pair.new':
                    var $505 = self.fst;
                    var $506 = self.snd;
                    var $507 = Array$tie$($505, _rec$7($506));
                    var $504 = $507;
                    break;
            };
            return $504;
        }), _idx$3)(_arr$5);
        return $498;
    };
    const Array$mut = x0 => x1 => x2 => Array$mut$(x0, x1, x2);

    function Array$set$(_idx$3, _val$4, _arr$5) {
        var $508 = Array$mut$(_idx$3, (_x$6 => {
            var $509 = _val$4;
            return $509;
        }), _arr$5);
        return $508;
    };
    const Array$set = x0 => x1 => x2 => Array$set$(x0, x1, x2);
    const Buffer32$set = a0 => a1 => a2 => ((a2[a0] = a1, a2));
    const Image3D$set_pos = a0 => a1 => a2 => ((a2.buffer[a0 * 2] = a1, a2));
    const Image3D$set_col = a0 => a1 => a2 => ((a2.buffer[a0 * 2 + 1] = a1, a2));
    const Image3D$push = a0 => a1 => a2 => ((a2.buffer[a2.length * 2] = a0, a2.buffer[a2.length * 2 + 1] = a1, a2.length++, a2));

    function Image3D$parse$(_voxdata$1) {
        var _siz$2 = (((_voxdata$1.length) / 12) >>> 0);
        var _img$3 = Image3D$alloc_capacity$(_siz$2);
        var $510 = (() => {
            var $511 = _img$3;
            var $512 = 0;
            var $513 = _siz$2;
            let _img$5 = $511;
            for (let _i$4 = $512; _i$4 < $513; ++_i$4) {
                var _x$6 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 0) >>> 0), _voxdata$1);
                var _y$7 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 1) >>> 0), _voxdata$1);
                var _z$8 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 2) >>> 0), _voxdata$1);
                var _r$9 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 3) >>> 0), _voxdata$1);
                var _g$10 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 4) >>> 0), _voxdata$1);
                var _b$11 = Image3D$parse_byte$(((((_i$4 * 6) >>> 0) + 5) >>> 0), _voxdata$1);
                var _pos$12 = ((0 | _x$6 | (_y$7 << 12) | (_z$8 << 24)));
                var _col$13 = ((0 | _r$9 | (_g$10 << 8) | (_b$11 << 16) | (255 << 24)));
                var _img$14 = ((_img$5.buffer[_img$5.length * 2] = _pos$12, _img$5.buffer[_img$5.length * 2 + 1] = _col$13, _img$5.length++, _img$5));
                var $511 = _img$14;
                _img$5 = $511;
            };
            return _img$5;
        })();
        return $510;
    };
    const Image3D$parse = x0 => Image3D$parse$(x0);
    const Mons$Assets$char$boy_r_0 = Image3D$parse$("83711a2c333d84711a2c333d7c72192c333d7d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d8372195f35388472192c333d7b73182c333d7c73189f5b447d73189f5b447e73189f5b447f73189f5b448073189f5b448173189f5b448273186f403b8373185f35388473182c333d8573182c333d8673182c333d7a74172c333d7b74176f403b7c7417884e3f7d7417884e3f7e7417884e3f7f7417884e3f807417884e3f8174176f403b8274176f403b8374176f403b8474175f35388574175f35388674172c333d7975162c333d7a75165f35387b75166f403b7c75166f403b7d75166f403b7e75166f403b7f75166f403b8075166f403b8175166f403b8275166f403b8375166f403b8475166f403b8575165f35387976152c333d7a76155f35387b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376155f35388476156f403b8576156f403b8676152c333d7977142c333d7a77145f35387b77145f35387c77146f403b7d77146f403b7e77146f403b7f77146f403b8077146f403b8177146f403b8277145f35388377142c333d8477145f35388577146f403b8677142c333d7978132c333d7a78135f35387b78135f35387c78135f35387d78135f35387e78136f403b7f78136f403b8078135f35388178135f35388278132c333d837813a5876e8478132c333d8578135f35388678132c333d7979122c333d7a79125f35387b79125f35387c79125f35387d79125f35387e79125f35387f79125f35388079122c333d8179122c333d827912a5876e8379122c333d847912a5876e8579122c333d7a7a112c333d7b7a115f35387c7a115f35387d7a115f35387e7a115f35387f7a112c333d807a11a5876e817a11ae9379827a11bba38a837a113f4353847a11cab89d857a112c333d7b7b102c333d7c7b102c333d7d7b102c333d7e7b102c333d7f7b10a5876e807b10ae9379817b10ae9379827b10db6176837b10fa83a9847b102c333d7c7c0f2c333d7d7c0f98202e7e7c0f98202e7f7c0f98202e807c0f98202e817c0fa43234827c0fb64c3b837c0fb64c3b847c0f2c333d7c7d0e2c333d7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0ea43234827d0ea43234837d0ea43234847d0e2c333d7c7e0d2c333d7d7e0d2a638e7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d2a638e837e0d2c333d7c7f0c2c333d7d7f0c428a9b7e7f0c428a9b7f7f0c63a9a4807f0c63a9a4817f0c63a9a4827f0c63a9a4837f0c2c333d7c800b2c333d7d800b428a9b7e800b428a9b7f800b428a9b80800b63a9a481800b63a9a482800b63a9a483800b2c333d7c810a2c333d7d810a2a638e7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a2c333d7c82092c333d7d82092a638e7e82092a638e7f82092a638e8082092a638e8182092c333d7d83082c333d7e83082c333d7f83082c333d8083082c333d8183082c333d7d84072c333d7e8407ae93797f8407ae9379808407bba38a818407bba38a8284072c333d7e85062c333d7f85062c333d8085062c333d8185062c333d8285062c333d");
    const Mons$Assets$char$boy_u_0 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72199f5b447d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d7973182c333d7a73182c333d7b73182c333d7c7318884e3f7d73186f403b7e73186f403b7f73186f403b8073186f403b8173186f403b827318884e3f8373182c333d7974172c333d7a74179f5b447b7417884e3f7c74176f403b7d74179f5b447e74176f403b7f74179f5b448074179f5b448174179f5b448274179f5b448374176f403b8474172c333d7a75162c333d7b75166f403b7c75166f403b7d7516884e3f7e75166f403b7f7516884e3f807516884e3f817516884e3f827516884e3f8375166f403b8475169f5b448575162c333d7a76152c333d7b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b857615884e3f8676152c333d7977142c333d7a7714884e3f7b77146f403b7c77146f403b7d77146f403b7e77146f403b7f77146f403b8077146f403b8177146f403b8277146f403b8377146f403b8477146f403b8577146f403b8677142c333d7978132c333d7a78136f403b7b78135f35387c78135f35387d78136f403b7e78136f403b7f78136f403b8078136f403b8178136f403b8278136f403b8378135f35388478135f35388578135f35388678132c333d7979122c333d7a79125f35387b79125f35387c79125f35387d79125f35387e79125f35387f79125f35388079125f35388179125f35388279125f35388379125f35388479125f35388579122c333d8679122c333d7a7a112c333d7b7a115f35387c7a115f35387d7a115f35387e7a115f35387f7a115f3538807a115f3538817a115f3538827a115f3538837a115f3538847a115f3538857a112c333d7b7b102c333d7c7b105f35387d7b105f35387e7b105f35387f7b105f3538807b105f3538817b105f3538827b105f3538837b105f3538847b102c333d7c7c0f2c333d7d7c0f98202e7e7c0fa432347f7c0fb64c3b807c0fb64c3b817c0fa43234827c0f98202e837c0f2c333d7b7d0e2c333d7c7d0e2c333d7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0ea43234827d0e98202e837d0e2c333d847d0e2c333d7b7e0d2a638e7c7e0d428a9b7d7e0d428a9b7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d428a9b837e0d428a9b847e0d2a638e7a7f0c2c333d7b7f0c428a9b7c7f0c63a9a47d7f0c63a9a47e7f0c63a9a47f7f0c63a9a4807f0c63a9a4817f0c63a9a4827f0c63a9a4837f0c63a9a4847f0c428a9b857f0c2c333d7a800b2c333d7b800b63a9a47c800b63a9a47d800b63a9a47e800b63a9a47f800b63a9a480800b63a9a481800b63a9a482800b63a9a483800b63a9a484800b63a9a485800b2c333d7a810a2c333d7b810a428a9b7c810a428a9b7d810a428a9b7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a428a9b83810a428a9b84810a428a9b85810a2c333d7a82092c333d7b82092a638e7c82092a638e7d82092a638e7e82092a638e7f82092a638e8082092a638e8182092a638e8282092a638e8382092a638e8482092a638e8582092c333d7b83082c333d7c83082c333d7d83082c333d7e83082c333d7f83082c333d8083082c333d8183082c333d8283082c333d8383082c333d8483082c333d7c84072c333d7d8407ae93797e8407ae93797f84072c333d8084072c333d818407ae9379828407ae93798384072c333d7d85062c333d7e85062c333d8185062c333d8285062c333d");
    const Mons$Assets$char$boy_l_0 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72195f35387d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d8372192c333d7973182c333d7a73182c333d7b73182c333d7c73185f35387d73186f403b7e73189f5b447f73189f5b448073189f5b448173189f5b448273189f5b448373189f5b448473182c333d7974172c333d7a74175f35387b74175f35387c74176f403b7d74176f403b7e74176f403b7f7417884e3f807417884e3f817417884e3f827417884e3f837417884e3f8474176f403b8574172c333d7a75165f35387b75166f403b7c75166f403b7d75166f403b7e75166f403b7f75166f403b8075166f403b8175166f403b8275166f403b8375166f403b8475166f403b8575165f35388675162c333d7976152c333d7a76156f403b7b76156f403b7c76155f35387d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b8576155f35388676152c333d7977142c333d7a77146f403b7b77145f35387c77142c333d7d77145f35387e77146f403b7f77146f403b8077146f403b8177146f403b8277146f403b8377146f403b8477145f35388577145f35388677142c333d7978132c333d7a78135f35387b78132c333d7c7813a5876e7d78132c333d7e78135f35387f78135f35388078136f403b8178136f403b8278135f35388378135f35388478135f35388578135f35388678132c333d7a79122c333d7b7912a5876e7c79122c333d7d7912a5876e7e79122c333d7f79122c333d8079125f35388179125f35388279125f35388379125f35388479125f35388579125f35388679122c333d7a7a112c333d7b7a11cab89d7c7a113f43537d7a11bba38a7e7a11ae93797f7a11a5876e807a112c333d817a115f3538827a115f3538837a115f3538847a115f3538857a112c333d7b7b102c333d7c7b10fa83a97d7b10db61767e7b10ae93797f7b10ae9379807b10a5876e817b102c333d827b102c333d837b102c333d847b102c333d7b7c0f2c333d7c7c0fb64c3b7d7c0fb64c3b7e7c0fa432347f7c0f98202e807c0f98202e817c0f98202e827c0f98202e837c0f2c333d7b7d0e2c333d7c7d0ea432347d7d0ea432347e7d0ea432347f7d0ea43234807d0ea43234817d0e98202e827d0e98202e837d0e2c333d7c7e0d2c333d7d7e0d2a638e7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d2a638e837e0d2c333d7c7f0c2c333d7d7f0c63a9a47e7f0c63a9a47f7f0c63a9a4807f0c63a9a4817f0c428a9b827f0c428a9b837f0c2c333d7c800b2c333d7d800b63a9a47e800b63a9a47f800b63a9a480800b428a9b81800b428a9b82800b428a9b83800b2c333d7d810a2c333d7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a2a638e83810a2c333d7e82092c333d7f82092a638e8082092a638e8182092a638e8282092a638e8382092c333d7e83082c333d7f83082c333d8083082c333d8183082c333d8283082c333d7d84072c333d7e8407bba38a7f8407bba38a808407ae9379818407ae93798284072c333d7d85062c333d7e85062c333d7f85062c333d8085062c333d8185062c333d");
    const Mons$Assets$char$boy_d_0 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72199f5b447d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d7973182c333d7a73182c333d7b73182c333d7c7318884e3f7d73186f403b7e73186f403b7f73186f403b8073186f403b8173186f403b827318884e3f8373182c333d7974172c333d7a74179f5b447b7417884e3f7c74176f403b7d74179f5b447e74176f403b7f74179f5b448074179f5b448174179f5b448274179f5b448374176f403b8474172c333d7a75162c333d7b75166f403b7c75166f403b7d7516884e3f7e75166f403b7f7516884e3f807516884e3f817516884e3f827516884e3f8375166f403b8475169f5b448575162c333d7a76152c333d7b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b857615884e3f8676152c333d7977142c333d7a7714884e3f7b77146f403b7c77145f35387d77142c333d7e77145f35387f77146f403b8077146f403b8177145f35388277145f35388377145f35388477145f35388577146f403b8677142c333d7978132c333d7a78136f403b7b78135f35387c78132c333d7d7813a5876e7e78132c333d7f78135f35388078135f35388178132c333d8278132c333d8378132c333d8478132c333d8578135f35388678132c333d7979122c333d7a79125f35387b79122c333d7c7912a5876e7d79122c333d7e7912a5876e7f79122c333d8079122c333d817912a5876e8279122c333d837912a5876e847912a5876e8579122c333d8679122c333d7a7a112c333d7b7a11a5876e7c7a11bba38a7d7a113f43537e7a11bba38a7f7a11cab89d807a11cab89d817a11bba38a827a113f4353837a11bba38a847a11bba38a857a112c333d7b7b102c333d7c7b10db61767d7b10fa83a97e7b10ae93797f7b10bba38a807b10bba38a817b10ae9379827b10fa83a9837b10db6176847b102c333d7c7c0f2c333d7d7c0f98202e7e7c0fa432347f7c0fb64c3b807c0fb64c3b817c0fa43234827c0f98202e837c0f2c333d7b7d0e2c333d7c7d0e2c333d7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0e98202e827d0e98202e837d0e2c333d847d0e2c333d7b7e0d2a638e7c7e0d428a9b7d7e0d428a9b7e7e0d428a9b7f7e0d2a638e807e0d98202e817e0d98202e827e0d428a9b837e0d428a9b847e0d2a638e7a7f0c2c333d7b7f0c428a9b7c7f0c63a9a47d7f0c63a9a47e7f0c63a9a47f7f0c428a9b807f0c98202e817f0c98202e827f0c63a9a4837f0c63a9a4847f0c428a9b857f0c2c333d7a800b2c333d7b800b63a9a47c800b63a9a47d800b63a9a47e800b428a9b7f800b2c333d80800ba4323481800ba4323482800b63a9a483800b63a9a484800b63a9a485800b2c333d7a810a2c333d7b810a428a9b7c810a428a9b7d810a428a9b7e810a2c333d7f810a5f353880810a5f353881810a2c333d82810a428a9b83810a428a9b84810a428a9b85810a2c333d7a82092c333d7b82092a638e7c82092a638e7d82092c333d7e82095f35387f8209884e3f808209884e3f8182095f35388282092c333d8382092a638e8482092a638e8582092c333d7b83082c333d7c83082c333d7d83086f403b7e83086f403b7f83082c333d8083082c333d8183086f403b8283086f403b8383082c333d8483082c333d7c84072c333d7d8407ae93797e8407ae93797f84072c333d8084072c333d818407ae9379828407ae93798384072c333d7d85062c333d7e85062c333d8185062c333d8285062c333d");
    const Mons$Assets$char$boy_r_1 = Image3D$parse$("83711a2c333d84711a2c333d7c72192c333d7d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d8372195f35388472192c333d7b73182c333d7c73189f5b447d73189f5b447e73189f5b447f73189f5b448073189f5b448173189f5b448273186f403b8373185f35388473182c333d8573182c333d8673182c333d7a74172c333d7b74176f403b7c7417884e3f7d7417884e3f7e7417884e3f7f7417884e3f807417884e3f8174176f403b8274176f403b8374176f403b8474175f35388574175f35388674172c333d7975162c333d7a75165f35387b75166f403b7c75166f403b7d75166f403b7e75166f403b7f75166f403b8075166f403b8175166f403b8275166f403b8375166f403b8475166f403b8575165f35387976152c333d7a76155f35387b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376155f35388476156f403b8576156f403b8676152c333d7977142c333d7a77145f35387b77145f35387c77146f403b7d77146f403b7e77146f403b7f77146f403b8077146f403b8177146f403b8277145f35388377142c333d8477145f35388577146f403b8677142c333d7978132c333d7a78135f35387b78135f35387c78135f35387d78135f35387e78136f403b7f78136f403b8078135f35388178135f35388278132c333d837813a5876e8478132c333d8578135f35388678132c333d7979122c333d7a79125f35387b79125f35387c79125f35387d79125f35387e79125f35387f79125f35388079122c333d8179122c333d827912a5876e8379122c333d847912a5876e8579122c333d7a7a112c333d7b7a115f35387c7a115f35387d7a115f35387e7a115f35387f7a112c333d807a11a5876e817a11ae9379827a11bba38a837a113f4353847a11cab89d857a112c333d7b7b102c333d7c7b102c333d7d7b102c333d7e7b102c333d7f7b10a5876e807b10ae9379817b10ae9379827b10db6176837b10fa83a9847b102c333d7c7c0f2c333d7d7c0f98202e7e7c0f98202e7f7c0f98202e807c0f98202e817c0fa43234827c0fb64c3b837c0fb64c3b847c0f2c333d7c7d0e2c333d7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0ea43234827d0ea43234837d0ea43234847d0e2c333d7c7e0d2c333d7d7e0d2a638e7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d2a638e837e0d2c333d7c7f0c2c333d7d7f0c428a9b7e7f0c428a9b7f7f0c63a9a4807f0c63a9a4817f0c63a9a4827f0c63a9a4837f0c2c333d7b800b2c333d7c800b428a9b7d800b428a9b7e800b428a9b7f800b428a9b80800b63a9a481800b63a9a482800b428a9b83800b2c333d7a810a2c333d7b810a428a9b7c810a2c333d7d810a428a9b7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a2a638e83810a2c333d7b82092c333d7c8209ae93797d82092c333d7e82092c333d7f82092a638e8082092a638e8182092a638e8282092c333d8382092c333d7b83082c333d7c8308ae93797d8308ae93797e83082c333d7f83082c333d8083082c333d8183082c333d828308bba38a838308bba38a8483082c333d7b84072c333d7c8407bba38a7d84072c333d8084072c333d818407ae93798284072c333d8384072c333d8484072c333d7c85062c333d8185062c333d8285062c333d");
    const Mons$Assets$char$boy_u_1 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72199f5b447d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d7973182c333d7a73182c333d7b73182c333d7c7318884e3f7d73186f403b7e73186f403b7f73186f403b8073186f403b8173186f403b827318884e3f8373182c333d7974172c333d7a74179f5b447b7417884e3f7c74176f403b7d74179f5b447e74176f403b7f74179f5b448074179f5b448174179f5b448274179f5b448374176f403b8474172c333d7a75162c333d7b75166f403b7c75166f403b7d7516884e3f7e75166f403b7f7516884e3f807516884e3f817516884e3f827516884e3f8375166f403b8475169f5b448575162c333d7a76152c333d7b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b857615884e3f8676152c333d7977142c333d7a7714884e3f7b77146f403b7c77146f403b7d77146f403b7e77146f403b7f77146f403b8077146f403b8177146f403b8277146f403b8377146f403b8477146f403b8577146f403b8677142c333d7978132c333d7a78136f403b7b78135f35387c78135f35387d78136f403b7e78136f403b7f78136f403b8078136f403b8178136f403b8278136f403b8378135f35388478135f35388578135f35388678132c333d7979122c333d7a79125f35387b79125f35387c79125f35387d79125f35387e79125f35387f79125f35388079125f35388179125f35388279125f35388379125f35388479125f35388579122c333d8679122c333d7a7a112c333d7b7a115f35387c7a115f35387d7a115f35387e7a115f35387f7a115f3538807a115f3538817a115f3538827a115f3538837a115f3538847a115f3538857a112c333d7b7b102c333d7c7b105f35387d7b105f35387e7b105f35387f7b105f3538807b105f3538817b105f3538827b105f3538837b105f3538847b102c333d7b7c0f2c333d7c7c0f2c333d7d7c0f98202e7e7c0fa432347f7c0fb64c3b807c0fb64c3b817c0fa43234827c0f98202e837c0f2c333d7b7d0e2a638e7c7d0e2a638e7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0ea43234827d0e98202e837d0e2c333d847d0e2c333d7a7e0d2c333d7b7e0d428a9b7c7e0d428a9b7d7e0d428a9b7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d428a9b837e0d428a9b847e0d2a638e7a7f0c2c333d7b7f0c63a9a47c7f0c63a9a47d7f0c63a9a47e7f0c63a9a47f7f0c63a9a4807f0c63a9a4817f0c63a9a4827f0c63a9a4837f0c63a9a4847f0c428a9b857f0c2c333d7a800b2c333d7b800b428a9b7c800b63a9a47d800b63a9a47e800b63a9a47f800b63a9a480800b63a9a481800b63a9a482800b63a9a483800b63a9a484800b63a9a485800b2c333d7a810a2c333d7b810a2a638e7c810a428a9b7d810a428a9b7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a428a9b83810a428a9b84810a428a9b85810a2c333d7b82092c333d7c82092a638e7d82092a638e7e82092a638e7f82092a638e8082092a638e8182092a638e8282092a638e8382092a638e8482092a638e8582092c333d7c83082c333d7d83082c333d7e83082c333d7f83082c333d8083082c333d8183082c333d8283082c333d8383082c333d8483082c333d8084072c333d818407ae9379828407ae93798384072c333d8185062c333d8285062c333d");
    const Mons$Assets$char$boy_l_1 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72195f35387d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d8372192c333d7973182c333d7a73182c333d7b73182c333d7c73185f35387d73186f403b7e73189f5b447f73189f5b448073189f5b448173189f5b448273189f5b448373189f5b448473182c333d7974172c333d7a74175f35387b74175f35387c74176f403b7d74176f403b7e74176f403b7f7417884e3f807417884e3f817417884e3f827417884e3f837417884e3f8474176f403b8574172c333d7a75165f35387b75166f403b7c75166f403b7d75166f403b7e75166f403b7f75166f403b8075166f403b8175166f403b8275166f403b8375166f403b8475166f403b8575165f35388675162c333d7976152c333d7a76156f403b7b76156f403b7c76155f35387d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b8576155f35388676152c333d7977142c333d7a77146f403b7b77145f35387c77142c333d7d77145f35387e77146f403b7f77146f403b8077146f403b8177146f403b8277146f403b8377146f403b8477145f35388577145f35388677142c333d7978132c333d7a78135f35387b78132c333d7c7813a5876e7d78132c333d7e78135f35387f78135f35388078136f403b8178136f403b8278135f35388378135f35388478135f35388578135f35388678132c333d7a79122c333d7b7912a5876e7c79122c333d7d7912a5876e7e79122c333d7f79122c333d8079125f35388179125f35388279125f35388379125f35388479125f35388579125f35388679122c333d7a7a112c333d7b7a11cab89d7c7a113f43537d7a11bba38a7e7a11ae93797f7a11a5876e807a112c333d817a115f3538827a115f3538837a115f3538847a115f3538857a112c333d7b7b102c333d7c7b10fa83a97d7b10db61767e7b10ae93797f7b10ae9379807b10a5876e817b102c333d827b102c333d837b102c333d847b102c333d7b7c0f2c333d7c7c0fb64c3b7d7c0fb64c3b7e7c0fa432347f7c0f98202e807c0f98202e817c0f98202e827c0f98202e837c0f2c333d7b7d0e2c333d7c7d0ea432347d7d0ea432347e7d0ea432347f7d0ea43234807d0ea43234817d0e98202e827d0e98202e837d0e2c333d7c7e0d2c333d7d7e0d2a638e7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d2a638e837e0d2c333d7c7f0c2c333d7d7f0c63a9a47e7f0c63a9a47f7f0c63a9a4807f0c63a9a4817f0c428a9b827f0c428a9b837f0c2c333d7c800b2c333d7d800b428a9b7e800b63a9a47f800b63a9a480800b428a9b81800b428a9b82800b428a9b83800b428a9b84800b2c333d7c810a2c333d7d810a2a638e7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a428a9b83810a2c333d84810a428a9b85810a2c333d7c82092c333d7d82092c333d7e82092a638e7f82092a638e8082092a638e8182092c333d8282092c333d838209ae93798482092c333d7b83082c333d7c8308bba38a7d8308bba38a7e83082c333d7f83082c333d8083082c333d8183082c333d828308ae9379838308ae93798483082c333d7b84072c333d7c84072c333d7d84072c333d7e8407ae93797f84072c333d8284072c333d838407bba38a8484072c333d7d85062c333d7e85062c333d8385062c333d");
    const Mons$Assets$char$boy_d_1 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72199f5b447d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d7973182c333d7a73182c333d7b73182c333d7c7318884e3f7d73186f403b7e73186f403b7f73186f403b8073186f403b8173186f403b827318884e3f8373182c333d7974172c333d7a74179f5b447b7417884e3f7c74176f403b7d74179f5b447e74176f403b7f74179f5b448074179f5b448174179f5b448274179f5b448374176f403b8474172c333d7a75162c333d7b75166f403b7c75166f403b7d7516884e3f7e75166f403b7f7516884e3f807516884e3f817516884e3f827516884e3f8375166f403b8475169f5b448575162c333d7a76152c333d7b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b857615884e3f8676152c333d7977142c333d7a7714884e3f7b77146f403b7c77145f35387d77142c333d7e77145f35387f77146f403b8077146f403b8177145f35388277145f35388377145f35388477145f35388577146f403b8677142c333d7978132c333d7a78136f403b7b78135f35387c78132c333d7d7813a5876e7e78132c333d7f78135f35388078135f35388178132c333d8278132c333d8378132c333d8478132c333d8578135f35388678132c333d7979122c333d7a79125f35387b79122c333d7c7912a5876e7d79122c333d7e7912a5876e7f79122c333d8079122c333d817912a5876e8279122c333d837912a5876e847912a5876e8579122c333d8679122c333d7a7a112c333d7b7a11a5876e7c7a11bba38a7d7a113f43537e7a11bba38a7f7a11cab89d807a11cab89d817a11bba38a827a113f4353837a11bba38a847a11bba38a857a112c333d7b7b102c333d7c7b10db61767d7b10fa83a97e7b10ae93797f7b10bba38a807b10bba38a817b10ae9379827b10fa83a9837b10db6176847b102c333d7b7c0f2c333d7c7c0f2c333d7d7c0f98202e7e7c0fa432347f7c0fb64c3b807c0fb64c3b817c0fa43234827c0f98202e837c0f2c333d7a7d0e2c333d7b7d0e2a638e7c7d0e2a638e7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0e98202e827d0e98202e837d0e2c333d847d0e2c333d7a7e0d2c333d7b7e0d63a9a47c7e0d63a9a47d7e0d428a9b7e7e0d428a9b7f7e0d2a638e807e0d98202e817e0d98202e827e0d428a9b837e0d428a9b847e0d2a638e857e0d2a638e7a7f0c2c333d7b7f0c63a9a47c7f0c63a9a47d7f0c63a9a47e7f0c63a9a47f7f0c428a9b807f0c98202e817f0c98202e827f0c63a9a4837f0c63a9a4847f0c63a9a4857f0c2c333d7a800b2c333d7b800b428a9b7c800b428a9b7d800b428a9b7e800b428a9b7f800b428a9b80800ba4323481800ba4323482800b63a9a483800b63a9a484800b63a9a485800b2c333d7a810a2c333d7b810a2a638e7c810a2a638e7d810a2c333d7e810a2c333d7f810a5f353880810a5f353881810a428a9b82810a428a9b83810a428a9b84810a428a9b85810a2c333d7b82092c333d7c82092c333d7d82095f35387e82095f35387f8209884e3f808209884e3f8182092c333d8282092a638e8382092a638e8482092c333d7c83082c333d7d83086f403b7e83086f403b7f83082c333d8083082c333d8183082c333d8283082c333d8383082c333d7c84072c333d7d8407ae93797e8407ae93797f84072c333d7d85062c333d7e85062c333d");
    const Mons$Assets$char$boy_r_2 = Image3D$parse$("83711a2c333d84711a2c333d7c72192c333d7d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d8372195f35388472192c333d7b73182c333d7c73189f5b447d73189f5b447e73189f5b447f73189f5b448073189f5b448173189f5b448273186f403b8373185f35388473182c333d8573182c333d8673182c333d7a74172c333d7b74176f403b7c7417884e3f7d7417884e3f7e7417884e3f7f7417884e3f807417884e3f8174176f403b8274176f403b8374176f403b8474175f35388574175f35388674172c333d7975162c333d7a75165f35387b75166f403b7c75166f403b7d75166f403b7e75166f403b7f75166f403b8075166f403b8175166f403b8275166f403b8375166f403b8475166f403b8575165f35387976152c333d7a76155f35387b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376155f35388476156f403b8576156f403b8676152c333d7977142c333d7a77145f35387b77145f35387c77146f403b7d77146f403b7e77146f403b7f77146f403b8077146f403b8177146f403b8277145f35388377142c333d8477145f35388577146f403b8677142c333d7978132c333d7a78135f35387b78135f35387c78135f35387d78135f35387e78136f403b7f78136f403b8078135f35388178135f35388278132c333d837813a5876e8478132c333d8578135f35388678132c333d7979122c333d7a79125f35387b79125f35387c79125f35387d79125f35387e79125f35387f79125f35388079122c333d8179122c333d827912a5876e8379122c333d847912a5876e8579122c333d7a7a112c333d7b7a115f35387c7a115f35387d7a115f35387e7a115f35387f7a112c333d807a11a5876e817a11ae9379827a11bba38a837a113f4353847a11cab89d857a112c333d7b7b102c333d7c7b102c333d7d7b102c333d7e7b102c333d7f7b10a5876e807b10ae9379817b10ae9379827b10db6176837b10fa83a9847b102c333d7c7c0f2c333d7d7c0f98202e7e7c0f98202e7f7c0f98202e807c0f98202e817c0fa43234827c0fb64c3b837c0fb64c3b847c0f2c333d7c7d0e2c333d7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0ea43234827d0ea43234837d0ea43234847d0e2c333d7c7e0d2c333d7d7e0d2a638e7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d2a638e837e0d2c333d7c7f0c2c333d7d7f0c428a9b7e7f0c428a9b7f7f0c63a9a4807f0c63a9a4817f0c63a9a4827f0c63a9a4837f0c2c333d7c800b2c333d7d800b428a9b7e800b428a9b7f800b428a9b80800b63a9a481800b63a9a482800b428a9b83800b2c333d7b810a2c333d7c810a428a9b7d810a428a9b7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a2a638e83810a2c333d7a82092c333d7b82092a638e7c82092a638e7d82092a638e7e82092a638e7f82092a638e8082092a638e8182092a638e8282092a638e8382092c333d8482092c333d7a83082c333d7b83082a638e7c83082a638e7d83082a638e7e83082c333d7f83082c333d8083082c333d8183082a638e8283082c333d838308ae93798483082c333d7b84072c333d7c84072c333d7d84072c333d8184072c333d828407ae9379838407ae93798484072c333d7c85062c333d8285062c333d8385062c333d");
    const Mons$Assets$char$boy_u_2 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72199f5b447d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d7973182c333d7a73182c333d7b73182c333d7c7318884e3f7d73186f403b7e73186f403b7f73186f403b8073186f403b8173186f403b827318884e3f8373182c333d7974172c333d7a74179f5b447b7417884e3f7c74176f403b7d74179f5b447e74176f403b7f74179f5b448074179f5b448174179f5b448274179f5b448374176f403b8474172c333d7a75162c333d7b75166f403b7c75166f403b7d7516884e3f7e75166f403b7f7516884e3f807516884e3f817516884e3f827516884e3f8375166f403b8475169f5b448575162c333d7a76152c333d7b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b857615884e3f8676152c333d7977142c333d7a7714884e3f7b77146f403b7c77146f403b7d77146f403b7e77146f403b7f77146f403b8077146f403b8177146f403b8277146f403b8377146f403b8477146f403b8577146f403b8677142c333d7978132c333d7a78136f403b7b78135f35387c78135f35387d78136f403b7e78136f403b7f78136f403b8078136f403b8178136f403b8278136f403b8378135f35388478135f35388578135f35388678132c333d7979122c333d7a79125f35387b79125f35387c79125f35387d79125f35387e79125f35387f79125f35388079125f35388179125f35388279125f35388379125f35388479125f35388579122c333d8679122c333d7a7a112c333d7b7a115f35387c7a115f35387d7a115f35387e7a115f35387f7a115f3538807a115f3538817a115f3538827a115f3538837a115f3538847a115f3538857a112c333d7b7b102c333d7c7b105f35387d7b105f35387e7b105f35387f7b105f3538807b105f3538817b105f3538827b105f3538837b105f3538847b102c333d7c7c0f2c333d7d7c0f98202e7e7c0fa432347f7c0fb64c3b807c0fb64c3b817c0fa43234827c0f98202e837c0f2c333d847c0f2c333d7b7d0e2c333d7c7d0e2c333d7d7d0e98202e7e7d0ea432347f7d0ea43234807d0ea43234817d0e98202e827d0e98202e837d0e2a638e847d0e2a638e7b7e0d2a638e7c7e0d428a9b7d7e0d428a9b7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d428a9b837e0d428a9b847e0d428a9b857e0d2c333d7a7f0c2c333d7b7f0c428a9b7c7f0c63a9a47d7f0c63a9a47e7f0c63a9a47f7f0c63a9a4807f0c63a9a4817f0c63a9a4827f0c63a9a4837f0c63a9a4847f0c63a9a4857f0c2c333d7a800b2c333d7b800b63a9a47c800b63a9a47d800b63a9a47e800b63a9a47f800b63a9a480800b63a9a481800b63a9a482800b63a9a483800b63a9a484800b428a9b85800b2c333d7a810a2c333d7b810a428a9b7c810a428a9b7d810a428a9b7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a428a9b83810a428a9b84810a2a638e85810a2c333d7a82092c333d7b82092a638e7c82092a638e7d82092a638e7e82092a638e7f82092a638e8082092a638e8182092a638e8282092a638e8382092a638e8482092c333d7b83082c333d7c83082c333d7d83082c333d7e83082c333d7f83082c333d8083082c333d8183082c333d8283082c333d8383082c333d7c84072c333d7d8407ae93797e8407ae93797f84072c333d7d85062c333d7e85062c333d");
    const Mons$Assets$char$boy_l_2 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72195f35387d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d8372192c333d7973182c333d7a73182c333d7b73182c333d7c73185f35387d73186f403b7e73189f5b447f73189f5b448073189f5b448173189f5b448273189f5b448373189f5b448473182c333d7974172c333d7a74175f35387b74175f35387c74176f403b7d74176f403b7e74176f403b7f7417884e3f807417884e3f817417884e3f827417884e3f837417884e3f8474176f403b8574172c333d7a75165f35387b75166f403b7c75166f403b7d75166f403b7e75166f403b7f75166f403b8075166f403b8175166f403b8275166f403b8375166f403b8475166f403b8575165f35388675162c333d7976152c333d7a76156f403b7b76156f403b7c76155f35387d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b8576155f35388676152c333d7977142c333d7a77146f403b7b77145f35387c77142c333d7d77145f35387e77146f403b7f77146f403b8077146f403b8177146f403b8277146f403b8377146f403b8477145f35388577145f35388677142c333d7978132c333d7a78135f35387b78132c333d7c7813a5876e7d78132c333d7e78135f35387f78135f35388078136f403b8178136f403b8278135f35388378135f35388478135f35388578135f35388678132c333d7a79122c333d7b7912a5876e7c79122c333d7d7912a5876e7e79122c333d7f79122c333d8079125f35388179125f35388279125f35388379125f35388479125f35388579125f35388679122c333d7a7a112c333d7b7a11cab89d7c7a113f43537d7a11bba38a7e7a11ae93797f7a11a5876e807a112c333d817a115f3538827a115f3538837a115f3538847a115f3538857a112c333d7b7b102c333d7c7b10fa83a97d7b10db61767e7b10ae93797f7b10ae9379807b10a5876e817b102c333d827b102c333d837b102c333d847b102c333d7b7c0f2c333d7c7c0fb64c3b7d7c0fb64c3b7e7c0fa432347f7c0f98202e807c0f98202e817c0f98202e827c0f98202e837c0f2c333d7b7d0e2c333d7c7d0ea432347d7d0ea432347e7d0ea432347f7d0ea43234807d0ea43234817d0e98202e827d0e98202e837d0e2c333d7c7e0d2c333d7d7e0d2a638e7e7e0d428a9b7f7e0d428a9b807e0d428a9b817e0d428a9b827e0d2a638e837e0d2c333d7c7f0c2c333d7d7f0c63a9a47e7f0c63a9a47f7f0c63a9a4807f0c63a9a4817f0c428a9b827f0c428a9b837f0c2c333d7c800b2c333d7d800b428a9b7e800b63a9a47f800b63a9a480800b428a9b81800b428a9b82800b428a9b83800b2c333d7c810a2c333d7d810a2a638e7e810a428a9b7f810a428a9b80810a428a9b81810a428a9b82810a428a9b83810a428a9b84810a2c333d7b82092c333d7c82092c333d7d82092a638e7e82092a638e7f82092a638e8082092a638e8182092a638e8282092a638e8382092a638e8482092a638e8582092c333d7b83082c333d7c8308ae93797d83082c333d7e83082a638e7f83082c333d8083082c333d8183082c333d8283082a638e8383082a638e8483082a638e8583082c333d7b84072c333d7c8407ae93797d8407ae93797e84072c333d8284072c333d8384072c333d8484072c333d7c85062c333d7d85062c333d8385062c333d");
    const Mons$Assets$char$boy_d_2 = Image3D$parse$("7b711a2c333d7c711a2c333d7b72192c333d7c72199f5b447d72192c333d7e72192c333d7f72192c333d8072192c333d8172192c333d8272192c333d7973182c333d7a73182c333d7b73182c333d7c7318884e3f7d73186f403b7e73186f403b7f73186f403b8073186f403b8173186f403b827318884e3f8373182c333d7974172c333d7a74179f5b447b7417884e3f7c74176f403b7d74179f5b447e74176f403b7f74179f5b448074179f5b448174179f5b448274179f5b448374176f403b8474172c333d7a75162c333d7b75166f403b7c75166f403b7d7516884e3f7e75166f403b7f7516884e3f807516884e3f817516884e3f827516884e3f8375166f403b8475169f5b448575162c333d7a76152c333d7b76156f403b7c76156f403b7d76156f403b7e76156f403b7f76156f403b8076156f403b8176156f403b8276156f403b8376156f403b8476156f403b857615884e3f8676152c333d7977142c333d7a7714884e3f7b77146f403b7c77145f35387d77142c333d7e77145f35387f77146f403b8077146f403b8177145f35388277145f35388377145f35388477145f35388577146f403b8677142c333d7978132c333d7a78136f403b7b78135f35387c78132c333d7d7813a5876e7e78132c333d7f78135f35388078135f35388178132c333d8278132c333d8378132c333d8478132c333d8578135f35388678132c333d7979122c333d7a79125f35387b79122c333d7c7912a5876e7d79122c333d7e7912a5876e7f79122c333d8079122c333d817912a5876e8279122c333d837912a5876e847912a5876e8579122c333d8679122c333d7a7a112c333d7b7a11a5876e7c7a11bba38a7d7a113f43537e7a11bba38a7f7a11cab89d807a11cab89d817a11bba38a827a113f4353837a11bba38a847a11bba38a857a112c333d7b7b102c333d7c7b10db61767d7b10fa83a97e7b10ae93797f7b10bba38a807b10bba38a817b10ae9379827b10fa83a9837b10db6176847b102c333d7c7c0f2c333d7d7c0f98202e7e7c0fa432347f7c0fb64c3b807c0fb64c3b817c0fa43234827c0f98202e837c0f2c333d847c0f2c333d7b7d0e2c333d7c7d0e2c333d7d7d0e98202e7e7d0e98202e7f7d0ea43234807d0ea43234817d0e98202e827d0e98202e837d0e2a638e847d0e2a638e857d0e2c333d7a7e0d2a638e7b7e0d2a638e7c7e0d428a9b7d7e0d428a9b7e7e0d428a9b7f7e0d2a638e807e0d98202e817e0d98202e827e0d428a9b837e0d63a9a4847e0d63a9a4857e0d2c333d7a7f0c2c333d7b7f0c63a9a47c7f0c63a9a47d7f0c63a9a47e7f0c63a9a47f7f0c428a9b807f0c98202e817f0c98202e827f0c63a9a4837f0c63a9a4847f0c63a9a4857f0c2c333d7a800b2c333d7b800b63a9a47c800b63a9a47d800b63a9a47e800b63a9a47f800b428a9b80800ba4323481800ba4323482800b428a9b83800b428a9b84800b428a9b85800b2c333d7a810a2c333d7b810a428a9b7c810a428a9b7d810a428a9b7e810a428a9b7f810a5f353880810a5f353881810a2c333d82810a2c333d83810a2a638e84810a2a638e85810a2c333d7b82092c333d7c82092a638e7d82092a638e7e82092c333d7f8209884e3f808209884e3f8182095f35388282095f35388382092c333d8482092c333d7c83082c333d7d83082c333d7e83082c333d7f83082c333d8083082c333d8183086f403b8283086f403b8383082c333d8084072c333d818407ae9379828407ae93798384072c333d8185062c333d8285062c333d");
    const Bool$if = a0 => a1 => a2 => (a0 ? a1 : a2);
    const Mons$Assets$char$battle_boy_u = Image3D$parse$("7569072c333d7669072c333d7769072c333d7869072c333d746a072c333d756a07884e3f766a07884e3f776a07884e3f786a076f403b796a072c333d746b072c333d756b07884e3f766b07884e3f776b07884e3f786b076f403b796b072c333d6e6c072c333d6f6c072c333d706c072c333d726c072c333d736c072c333d746c07884e3f756c07884e3f766c07884e3f776c076f403b786c076f403b796c072c333d7a6c072c333d7b6c072c333d7c6c072c333d7d6c072c333d7e6c072c333d7f6c072c333d806c072c333d816c072c333d826c072c333d836c072c333d6d6d072c333d6e6d07884e3f6f6d07884e3f706d07884e3f716d072c333d726d07884e3f736d07884e3f746d07884e3f756d07884e3f766d07884e3f776d076f403b786d072c333d796d076f403b7a6d076f403b7b6d076f403b7c6d07884e3f7d6d07884e3f7e6d07884e3f7f6d07884e3f806d07884e3f816d07884e3f826d07884e3f836d07884e3f846d072c333d6d6e072c333d6e6e07884e3f6f6e07884e3f706e07884e3f716e072c333d726e07884e3f736e07884e3f746e07884e3f756e07884e3f766e07884e3f776e076f403b786e072c333d796e076f403b7a6e076f403b7b6e076f403b7c6e07884e3f7d6e07884e3f7e6e07884e3f7f6e07884e3f806e07884e3f816e07884e3f826e07884e3f836e07884e3f846e072c333d6d6f072c333d6e6f07884e3f6f6f07884e3f706f07884e3f716f07884e3f726f07884e3f736f07884e3f746f07884e3f756f07884e3f766f076f403b776f076f403b786f076f403b796f076f403b7a6f076f403b7b6f07884e3f7c6f07884e3f7d6f07884e3f7e6f07884e3f7f6f07884e3f806f07884e3f816f07884e3f826f07884e3f836f07884e3f846f076f403b856f072c333d866f072c333d876f072c333d886f072c333d896f072c333d8a6f072c333d8b6f072c333d6d70072c333d6e7007884e3f6f7007884e3f707007884e3f717007884e3f727007884e3f737007884e3f747007884e3f757007884e3f7670076f403b7770076f403b7870076f403b7970076f403b7a70076f403b7b7007884e3f7c7007884e3f7d7007884e3f7e7007884e3f7f7007884e3f807007884e3f817007884e3f827007884e3f837007884e3f8470076f403b8570076f403b8670076f403b8770076f403b8870076f403b8970076f403b8a70076f403b8b70076f403b8c70072c333d6d71072c333d6e71076f403b6f7107884e3f707107884e3f717107884e3f727107884e3f737107884e3f747107884e3f757107884e3f7671076f403b7771076f403b7871076f403b7971076f403b7a71076f403b7b7107884e3f7c7107884e3f7d7107884e3f7e7107884e3f7f7107884e3f807107884e3f817107884e3f827107884e3f837107884e3f8471076f403b8571076f403b8671076f403b877107884e3f887107884e3f897107884e3f8a71076f403b8b71076f403b8c71076f403b8d71072c333d6d72072c333d6e72076f403b6f72076f403b707207884e3f717207884e3f727207884e3f737207884e3f7472076f403b7572076f403b7672076f403b7772076f403b7872076f403b7972076f403b7a72076f403b7b72076f403b7c7207884e3f7d7207884e3f7e7207884e3f7f7207884e3f807207884e3f8172076f403b8272076f403b8372076f403b8472076f403b8572076f403b867207884e3f877207884e3f887207884e3f897207884e3f8a7207884e3f8b72076f403b8c72076f403b8d72076f403b8e72072c333d6e73072c333d6f73076f403b7073076f403b7173076f403b7273076f403b7373076f403b7473076f403b7573076f403b7673076f403b7773076f403b7873076f403b7973076f403b7a73076f403b7b73076f403b7c73076f403b7d73076f403b7e73076f403b7f73076f403b8073076f403b8173076f403b8273076f403b8373076f403b8473076f403b8573076f403b867307884e3f877307884e3f887307884e3f897307884e3f8a7307884e3f8b7307884e3f8c73076f403b8d73076f403b8e73076f403b8f73072c333d6e74072c333d6f74076f403b7074076f403b7174076f403b7274076f403b7374076f403b7474076f403b7574076f403b7674076f403b7774076f403b7874076f403b7974076f403b7a74076f403b7b74076f403b7c74076f403b7d74076f403b7e74076f403b7f74076f403b8074076f403b8174076f403b8274076f403b8374076f403b8474076f403b8574076f403b8674076f403b877407884e3f887407884e3f897407884e3f8a7407884e3f8b7407884e3f8c7407884e3f8d74076f403b8e74076f403b8f74072c333d6f75072c333d7075072c333d7175075f35387275075f35387375075f35387475075f35387575075f35387675075f35387775075f35387875076f403b7975076f403b7a75076f403b7b75076f403b7c7507884e3f7d7507884e3f7e75076f403b7f75076f403b8075076f403b8175076f403b8275076f403b8375076f403b8475076f403b8575076f403b8675076f403b8775076f403b887507884e3f897507884e3f8a7507884e3f8b7507884e3f8c7507884e3f8d75076f403b8e75076f403b8f75072c333d6e76072c333d6f76075f35387076075f35387176075f35387276075f35387376075f35387476075f35387576076f403b7676076f403b7776076f403b7876076f403b7976076f403b7a76076f403b7b7607884e3f7c7607884e3f7d7607884e3f7e7607884e3f7f76076f403b8076076f403b8176076f403b8276076f403b837607884e3f847607884e3f857607884e3f8676076f403b8776076f403b8876076f403b897607884e3f8a7607884e3f8b7607884e3f8c7607884e3f8d76076f403b8e76076f403b8f76072c333d6d77072c333d6e77075f35386f77075f35387077075f35387177076f403b7277076f403b7377076f403b7477076f403b7577076f403b7677076f403b7777076f403b7877076f403b7977076f403b7a7707884e3f7b7707884e3f7c7707884e3f7d7707884e3f7e7707884e3f7f7707884e3f8077076f403b8177076f403b827707884e3f837707884e3f847707884e3f857707884e3f867707884e3f8777076f403b8877076f403b8977076f403b8a7707884e3f8b7707884e3f8c77076f403b8d77076f403b8e77072c333d6c78072c333d6d78075f35386e78075f35386f78076f403b7078076f403b7178076f403b7278076f403b7378076f403b7478076f403b7578076f403b7678076f403b7778076f403b7878076f403b7978076f403b7a7807884e3f7b7807884e3f7c7807884e3f7d7807884e3f7e7807884e3f7f7807884e3f8078076f403b8178076f403b827807884e3f837807884e3f847807884e3f857807884e3f867807884e3f877807884e3f8878076f403b8978076f403b8a78076f403b8b78076f403b8c78076f403b8d78076f403b8e78072c333d6b79072c333d6c79076f403b6d79076f403b6e79076f403b6f79076f403b7079076f403b7179076f403b727907884e3f737907884e3f747907884e3f757907884e3f7679076f403b7779076f403b7879076f403b7979076f403b7a7907884e3f7b7907884e3f7c7907884e3f7d7907884e3f7e7907884e3f7f7907884e3f8079076f403b8179076f403b827907884e3f837907884e3f847907884e3f857907884e3f867907884e3f877907884e3f887907884e3f8979076f403b8a79076f403b8b79076f403b8c79072c333d8d79072c333d6b7a072c333d6c7a076f403b6d7a076f403b6e7a076f403b6f7a076f403b707a076f403b717a07884e3f727a07884e3f737a07884e3f747a07884e3f757a07884e3f767a076f403b777a076f403b787a076f403b797a076f403b7a7a076f403b7b7a07884e3f7c7a07884e3f7d7a07884e3f7e7a07884e3f7f7a07884e3f807a076f403b817a076f403b827a07884e3f837a07884e3f847a07884e3f857a07884e3f867a07884e3f877a07884e3f887a07884e3f897a07884e3f8a7a076f403b8b7a076f403b8c7a075f35388d7a075f35388e7a072c333d6b7b072c333d6c7b076f403b6d7b076f403b6e7b076f403b6f7b07884e3f707b07884e3f717b07884e3f727b07884e3f737b07884e3f747b07884e3f757b07884e3f767b076f403b777b076f403b787b076f403b797b076f403b7a7b076f403b7b7b07884e3f7c7b07884e3f7d7b07884e3f7e7b07884e3f7f7b07884e3f807b076f403b817b076f403b827b076f403b837b07884e3f847b07884e3f857b07884e3f867b07884e3f877b07884e3f887b07884e3f897b07884e3f8a7b076f403b8b7b076f403b8c7b075f35388d7b075f35388e7b072c333d6b7c072c333d6c7c076f403b6d7c076f403b6e7c07884e3f6f7c07884e3f707c07884e3f717c07884e3f727c07884e3f737c07884e3f747c07884e3f757c07884e3f767c076f403b777c076f403b787c076f403b797c076f403b7a7c076f403b7b7c076f403b7c7c07884e3f7d7c07884e3f7e7c07884e3f7f7c076f403b807c076f403b817c076f403b827c076f403b837c076f403b847c07884e3f857c07884e3f867c07884e3f877c07884e3f887c07884e3f897c07884e3f8a7c07884e3f8b7c076f403b8c7c075f35388d7c075f35388e7c075f35388f7c072c333d6b7d072c333d6c7d076f403b6d7d076f403b6e7d07884e3f6f7d07884e3f707d07884e3f717d07884e3f727d07884e3f737d07884e3f747d07884e3f757d076f403b767d076f403b777d076f403b787d076f403b797d076f403b7a7d076f403b7b7d076f403b7c7d076f403b7d7d076f403b7e7d076f403b7f7d076f403b807d076f403b817d076f403b827d076f403b837d076f403b847d076f403b857d07884e3f867d07884e3f877d07884e3f887d07884e3f897d07884e3f8a7d07884e3f8b7d076f403b8c7d075f35388d7d075f35388e7d075f35388f7d072c333d6b7e072c333d6c7e076f403b6d7e076f403b6e7e07884e3f6f7e07884e3f707e07884e3f717e07884e3f727e07884e3f737e07884e3f747e07884e3f757e076f403b767e076f403b777e076f403b787e076f403b797e076f403b7a7e076f403b7b7e076f403b7c7e076f403b7d7e076f403b7e7e076f403b7f7e076f403b807e076f403b817e076f403b827e076f403b837e076f403b847e076f403b857e076f403b867e07884e3f877e07884e3f887e07884e3f897e07884e3f8a7e07884e3f8b7e076f403b8c7e075f35388d7e075f35388e7e075f35388f7e072c333d6b7f072421266c7f076f403b6d7f076f403b6e7f076f403b6f7f07884e3f707f07884e3f717f07884e3f727f076f403b737f076f403b747f076f403b757f076f403b767f076f403b777f076f403b787f076f403b797f076f403b7a7f076f403b7b7f076f403b7c7f076f403b7d7f076f403b7e7f076f403b7f7f076f403b807f076f403b817f076f403b827f076f403b837f076f403b847f076f403b857f076f403b867f076f403b877f076f403b887f07884e3f897f07884e3f8a7f07884e3f8b7f076f403b8c7f075f35388d7f075f35388e7f075f35388f7f072c333d6b80072421266c80076f403b6d80076f403b6e80076f403b6f80076f403b7080076f403b7180076f403b7280076f403b7380076f403b7480076f403b7580076f403b7680076f403b7780076f403b7880076f403b7980076f403b7a80076f403b7b80076f403b7c80076f403b7d80076f403b7e80076f403b7f80076f403b8080076f403b8180076f403b8280076f403b8380076f403b8480076f403b8580076f403b8680076f403b8780076f403b8880076f403b8980076f403b8a80076f403b8b80076f403b8c80075f35388d80075f35388e80075f35388f80072c333d6b81072421266c81076f403b6d81076f403b6e81076f403b6f81076f403b7081076f403b7181076f403b7281076f403b7381076f403b7481076f403b7581076f403b7681076f403b7781076f403b7881076f403b7981076f403b7a81076f403b7b81076f403b7c81076f403b7d81076f403b7e81076f403b7f81076f403b8081076f403b8181076f403b8281076f403b8381076f403b8481076f403b8581076f403b8681076f403b8781076f403b8881076f403b8981076f403b8a81076f403b8b81075f35388c81075f35388d81075f35388e81075f35388f81072c333d6b82072421266c82076f403b6d82076f403b6e82076f403b6f82076f403b7082076f403b7182076f403b7282075f35387382076f403b7482075f35387582076f403b7682075f35387782076f403b7882075f35387982076f403b7a82075f35387b82076f403b7c82075f35387d82076f403b7e82075f35387f82076f403b8082075f35388182076f403b8282075f35388382076f403b8482076f403b8582076f403b8682076f403b8782076f403b8882075f35388982075f35388a82075f35388b82075f35388c82075f35388d82075f35388e82075f35388f82072c333d6c83072421266d83075f35386e83075f35386f83075f35387083076f403b7183076f403b7283076f403b7383076f403b7483076f403b7583076f403b7683076f403b7783076f403b7883076f403b7983076f403b7a83076f403b7b83076f403b7c83076f403b7d83076f403b7e83076f403b7f83076f403b8083076f403b8183076f403b8283076f403b8383076f403b8483076f403b8583076f403b8683076f403b8783075f35388883075f35388983075f35388a83075f35388b83075f35388c83075f35388d83075f35388e83072c333d6d84072421266e84075f35386f84075f35387084075f35387184075f35387284076f403b7384075f35387484076f403b7584075f35387684076f403b7784075f35387884076f403b7984075f35387a84076f403b7b84075f35387c84076f403b7d84075f35387e84076f403b7f84075f35388084076f403b8184075f35388284076f403b8384075f35388484076f403b8584075f35388684075f35388784075f35388884075f35388984075f35388a84075f35388b84075f35388c84075f35388d84075f35388e84072c333d6d85072421266e85075f35386f85075f35387085075f35387185075f35387285075f35387385076f403b7485075f35387585076f403b7685075f35387785076f403b7885075f35387985076f403b7a85075f35387b85076f403b7c85075f35387d85076f403b7e85075f35387f85076f403b8085075f35388185076f403b8285075f35388385075f35388485075f35388585075f35388685075f35388785075f35388885075f35388985075f35388a85075f35388b85075f35388c85075f35388d85075f35388e85072421266e86072421266f86075f35387086075f35387186075f35387286075f35387386075f35387486075f35387586075f35387686075f35387786075f35387886075f35387986075f35387a86075f35387b86075f35387c86075f35387d86075f35387e86075f35387f86075f35388086075f35388186075f35388286075f35388386075f35388486075f35388586075f35388686075f35388786075f35388886075f35388986075f35388a86075f35388b86075f35388c86075f35388d86075f35388e86072421266e87072421266f87075f35387087075f35387187075f35387287075f35387387075f35387487075f35387587075f35387687075f35387787075f35387887075f35387987075f35387a87075f35387b87075f35387c87075f35387d87075f35387e87075f35387f87075f35388087075f35388187075f35388287075f35388387075f35388487075f35388587075f35388687075f35388787075f35388887075f35388987075f35388a87075f35388b87075f35388c87075f35388d87072421266e88072421266f88075f35387088075f35387188075f35387288075f35387388075f35387488075f35387588075f35387688075f35387788075f35387888075f35387988075f35387a88075f35387b88075f35387c88075f35387d88075f35387e88075f35387f88075f35388088075f35388188075f35388288075f35388388075f35388488075f35388588075f35388688075f35388788075f35388888075f35388988075f35388a88075f35388b88075f35388c88072421266c89072421266d89072421266e8907a432346f8907a43234708907a432347189075f35387289075f35387389075f35387489075f35387589075f35387689075f35387789075f35387889075f35387989075f35387a89075f35387b89075f35387c89075f35387d89075f35387e89075f35387f89075f35388089075f35388189075f35388289075f35388389075f35388489075f35388589075f35388689075f35388789075f35388889075f35388989075f35388a89075f35388b89072421266b8a072421266c8a0798202e6d8a0798202e6e8a07a432346f8a07a43234708a07a43234718a07a43234728a07a43234738a075f3538748a075f3538758a075f3538768a075f3538778a075f3538788a075f3538798a075f35387a8a075f35387b8a075f35387c8a075f35387d8a075f35387e8a075f35387f8a075f3538808a075f3538818a075f3538828a075f3538838a075f3538848a075f3538858a075f3538868a075f3538878a075f3538888a075f3538898a075f35388a8a075f35388b8a0798202e8c8a072421268d8a072421266b8b072421266c8b0798202e6d8b0798202e6e8b07a432346f8b07a43234708b07a43234718b07a43234728b07a43234738b07a43234748b07a43234758b075f3538768b075f3538778b075f3538788b075f3538798b075f35387a8b075f35387b8b075f35387c8b075f35387d8b075f35387e8b075f35387f8b075f3538808b075f3538818b075f3538828b075f3538838b075f3538848b075f3538858b075f3538868b075f3538878b075f3538888b07a43234898b07a432348a8b07a432348b8b0798202e8c8b072421268d8b072421266b8c072421266c8c0798202e6d8c0798202e6e8c0798202e6f8c07a43234708c07a43234718c07a43234728c07a43234738c07a43234748c07a43234758c07a43234768c07a43234778c07a43234788c07a43234798c07a432347a8c07a432347b8c07a432347c8c07a432347d8c07a432347e8c07a432347f8c07a43234808c07a43234818c07a43234828c07a43234838c07a43234848c07a43234858c07a43234868c07a43234878c07a43234888c07a43234898c07a432348a8c07a432348b8c0798202e8c8c072421268d8c072421266b8d072421266c8d0777262f6d8d0798202e6e8d0798202e6f8d0798202e708d07a43234718d07a43234728d07a43234738d07a43234748d07a43234758d07a43234768d07a43234778d07a43234788d07a43234798d07a432347a8d07a432347b8d07a432347c8d07a432347d8d07a432347e8d07a432347f8d07a43234808d07a43234818d07a43234828d07a43234838d07a43234848d07a43234858d07a43234868d07a43234878d07a43234888d07a43234898d0798202e8a8d0798202e8b8d0798202e8c8d072421268d8d072421266b8e072421266c8e0777262f6d8e0798202e6e8e0798202e6f8e0798202e708e0798202e718e0798202e728e07a43234738e07a43234748e07a43234758e07a43234768e07a43234778e07a43234788e07a43234798e07a432347a8e07a432347b8e07a432347c8e07a432347d8e07a432347e8e07a432347f8e07a43234808e07a43234818e07a43234828e07a43234838e07a43234848e07a43234858e07a43234868e07a43234878e07a43234888e0798202e898e0798202e8a8e0798202e8b8e0798202e8c8e072421268d8e072421266b8f072421266c8f0777262f6d8f0798202e6e8f0798202e6f8f0798202e708f0798202e718f0798202e728f0798202e738f0798202e748f07a43234758f07a43234768f07a43234778f07a43234788f07a43234798f07a432347a8f07a432347b8f07a432347c8f07a432347d8f07a432347e8f07a432347f8f07a43234808f07a43234818f07a43234828f07a43234838f07a43234848f07a43234858f07a43234868f07a43234878f0798202e888f0798202e898f0798202e8a8f0798202e8b8f0777262f8c8f072421268d8f072421266b90072421266c900777262f6d900777262f6e900798202e6f900798202e70900798202e71900798202e72900798202e73900798202e74900798202e75900798202e76900798202e779007a43234789007a43234799007a432347a9007a432347b9007a432347c9007a432347d9007a432347e9007a432347f9007a43234809007a43234819007a43234829007a43234839007a43234849007a4323485900798202e86900798202e87900798202e88900798202e89900798202e8a900798202e8b900777262f8c90072421268d90072421266b91072421266c910777262f6d910777262f6e910798202e6f910798202e70910798202e71910798202e72910798202e73910798202e74910798202e75910798202e76910798202e77910798202e78910798202e799107a432347a9107a432347b9107a432347c9107a432347d9107a432347e9107a432347f9107a43234809107a43234819107a4323482910798202e83910798202e84910798202e85910798202e86910798202e87910798202e88910798202e89910798202e8a910798202e8b910777262f8c91072421268d91072421266c92072421266d92072421266e920777262f6f920777262f70920777262f71920798202e72920798202e73920798202e74920798202e75920798202e76920798202e77920798202e78920798202e79920798202e7a920798202e7b920798202e7c920798202e7d920798202e7e920798202e7f920798202e80920798202e81920798202e82920798202e83920798202e84920798202e85920798202e86920777262f87920777262f88920777262f89920777262f8a920777262f8b92072421266b93072421266c93072a638e6d93072a638e6e93072a638e6f93072a638e7093072a638e71930777262f72930777262f73930798202e74930798202e75930798202e76930798202e77930798202e78930798202e79930798202e7a930798202e7b930798202e7c930798202e7d930798202e7e930798202e7f930798202e80930798202e81930798202e82930798202e83930777262f84930777262f85930777262f8693072a638e8793072a638e8893072a638e8993072421268a93072421268b93072421266b9407353b486c94073879966d94073879966e94073879966f940738799670940738799671940738799672940738799673940777262f74940777262f75940777262f76940798202e77940798202e78940798202e79940798202e7a940798202e7b940798202e7c940798202e7d940798202e7e940798202e7f940798202e80940798202e81940777262f82940777262f8394073879968494073879968594073879968694073879968794073879968894073879968994073879968a94073879968b94072421266b9507353b486c95073879966d95073879966e95073879966f950738799670950738799671950738799672950738799673950738799674950738799675950738799676950777262f77950777262f78950777262f79950777262f7a950777262f7b950777262f7c950777262f7d950777262f7e950777262f7f950777262f80950777262f8195073879968295073879968395073879968495073879968595073879968695073879968795073879968895073879968995073879968a95073879968b95072421266b9607353b486c96073879966d9607428a9b6e96073879966f9607428a9b709607387996719607428a9b729607387996739607428a9b749607387996759607428a9b7696073879967796073879967896073879967996073879967a96073879967b96073879967c96073879967d96073879967e96073879967f96073879968096073879968196073879968296073879968396073879968496073879968596073879968696073879968796073879968896073879968996073879968a96073879968b96073879968c9607353b486a9707353b486b97073879966c9707428a9b6d97073879966e9707428a9b6f9707387996709707428a9b719707387996729707428a9b739707387996749707428a9b759707387996769707428a9b779707387996789707428a9b7997073879967a9707428a9b7b97073879967c9707428a9b7d97073879967e9707428a9b7f9707387996809707428a9b819707387996829707428a9b839707387996849707428a9b859707387996869707428a9b879707387996889707428a9b8997073879968a9707428a9b8b97073879968c9707353b486a9807353b486b9807428a9b6c9807428a9b6d9807428a9b6e9807428a9b6f9807428a9b709807428a9b719807428a9b729807428a9b739807428a9b749807428a9b759807428a9b769807428a9b779807428a9b789807428a9b799807428a9b7a9807428a9b7b9807428a9b7c9807428a9b7d9807428a9b7e9807428a9b7f9807428a9b809807428a9b819807428a9b829807428a9b839807428a9b849807428a9b859807428a9b869807428a9b879807428a9b889807428a9b899807428a9b8a9807428a9b8b9807428a9b8c9807353b486a9907353b486b9907428a9b6c99073879966d9907428a9b6e99073879966f9907428a9b709907387996719907428a9b729907387996739907428a9b749907387996759907428a9b769907387996779907428a9b789907387996799907428a9b7a99073879967b9907428a9b7c99073879967d9907428a9b7e99073879967f9907428a9b809907387996819907428a9b829907387996839907428a9b849907387996859907428a9b869907387996879907428a9b889907387996899907428a9b8a99073879968b9907428a9b8c9907353b486a9a072421266b9a07428a9b6c9a07428a9b6d9a07428a9b6e9a07428a9b6f9a07428a9b709a07428a9b719a07428a9b729a07428a9b739a07428a9b749a07428a9b759a07428a9b769a07428a9b779a07428a9b789a07428a9b799a07428a9b7a9a07428a9b7b9a07428a9b7c9a07428a9b7d9a07428a9b7e9a07428a9b7f9a07428a9b809a07428a9b819a07428a9b829a07428a9b839a07428a9b849a07428a9b859a07428a9b869a07428a9b879a07428a9b889a07428a9b899a07428a9b8a9a07428a9b8b9a07428a9b8c9a07353b486a9b072421266b9b07428a9b6c9b07428a9b6d9b07428a9b6e9b07428a9b6f9b07428a9b709b07428a9b719b07428a9b729b07428a9b739b07428a9b749b07428a9b759b07428a9b769b07428a9b779b07428a9b789b07428a9b799b07428a9b7a9b07428a9b7b9b07428a9b7c9b07428a9b7d9b07428a9b7e9b07428a9b7f9b07428a9b809b07428a9b819b07428a9b829b07428a9b839b07428a9b849b07428a9b859b07428a9b869b07428a9b879b07428a9b889b07428a9b899b07428a9b8a9b07428a9b8b9b07428a9b8c9b07353b48699c072421266a9c07428a9b6b9c07428a9b6c9c07428a9b6d9c07428a9b6e9c07428a9b6f9c07428a9b709c07428a9b719c07428a9b729c07428a9b739c07428a9b749c07428a9b759c07428a9b769c07428a9b779c07428a9b789c07428a9b799c07428a9b7a9c07428a9b7b9c07428a9b7c9c07428a9b7d9c07428a9b7e9c07428a9b7f9c07428a9b809c07428a9b819c07428a9b829c07428a9b839c07428a9b849c07428a9b859c07428a9b869c07428a9b879c07428a9b889c07428a9b899c07428a9b8a9c07428a9b8b9c07428a9b8c9c07353b48699d072421266a9d072a638e6b9d07428a9b6c9d072a638e6d9d07428a9b6e9d072a638e6f9d07428a9b709d072a638e719d07428a9b729d072a638e739d07428a9b749d072a638e759d07428a9b769d072a638e779d07428a9b789d072a638e799d07428a9b7a9d072a638e7b9d07428a9b7c9d072a638e7d9d07428a9b7e9d072a638e7f9d07428a9b809d072a638e819d07428a9b829d072a638e839d07428a9b849d072a638e859d07428a9b869d072a638e879d07428a9b889d072a638e899d07428a9b8a9d072a638e8b9d07428a9b8c9d07353b48699e072421266a9e07428a9b6b9e072a638e6c9e07428a9b6d9e072a638e6e9e07428a9b6f9e072a638e709e07428a9b719e072a638e729e07428a9b739e072a638e749e07428a9b759e072a638e769e07428a9b779e072a638e789e07428a9b799e072a638e7a9e07428a9b7b9e072a638e7c9e07428a9b7d9e072a638e7e9e07428a9b7f9e072a638e809e07428a9b819e072a638e829e07428a9b839e072a638e849e07428a9b859e072a638e869e07428a9b879e072a638e889e07428a9b899e072a638e8a9e07428a9b8b9e072a638e8c9e07353b48699f072421266a9f072a638e6b9f072a638e6c9f072a638e6d9f072a638e6e9f072a638e6f9f072a638e709f072a638e719f072a638e729f072a638e739f072a638e749f072a638e759f072a638e769f072a638e779f072a638e789f072a638e799f072a638e7a9f072a638e7b9f072a638e7c9f072a638e7d9f072a638e7e9f072a638e7f9f072a638e809f072a638e819f072a638e829f072a638e839f072a638e849f072a638e859f072a638e869f072a638e879f072a638e889f072a638e899f072a638e8a9f072a638e8b9f072a638e8c9f07353b48");
    const Mons$Skill$hero_kill = ({
        _: 'Mons.Skill.hero_kill'
    });
    const Mons$Attr$new_hero = Mons$Attr$new$(Bool$false, 40, 0, "HERO", (_x$1 => _y$2 => _obj_ani$3 => _obj_dir$4 => {
        var $514 = Mons$walk_char_pack$(_x$1, _y$2, _obj_ani$3, _obj_dir$4, Mons$Assets$char$boy_r_0, Mons$Assets$char$boy_u_0, Mons$Assets$char$boy_l_0, Mons$Assets$char$boy_d_0, Mons$Assets$char$boy_r_1, Mons$Assets$char$boy_u_1, Mons$Assets$char$boy_l_1, Mons$Assets$char$boy_d_1, Mons$Assets$char$boy_r_2, Mons$Assets$char$boy_u_2, Mons$Assets$char$boy_l_2, Mons$Assets$char$boy_d_2);
        return $514;
    }), List$nil, Mons$Assets$char$boy_d_0, (_is_up$1 => {
        var $515 = (_is_up$1 ? Mons$Assets$char$battle_boy_u : Mons$Assets$char$battle_boy_u);
        return $515;
    }), List$cons$(Mons$Skill$hero_kill, List$cons$(Mons$Skill$none, List$cons$(Mons$Skill$none, List$cons$(Mons$Skill$none, List$nil)))), Mons$global_scr_mid);

    function Mons$Kind$set_static_sprites$(_spr$1, _x$2, _y$3, _obj_ani$4, _obj_dir$5) {
        var $516 = _spr$1;
        return $516;
    };
    const Mons$Kind$set_static_sprites = x0 => x1 => x2 => x3 => x4 => Mons$Kind$set_static_sprites$(x0, x1, x2, x3, x4);
    const Mons$Assets$char$mons_mage = Image3D$parse$("7d74172729607e74172729607f74172729608074172729608174172729608274172729607c75162729607d7516ae59b27e7516ae59b27f7516ae59b2807516ae59b2817516ae59b2827516ae59b28375162729607b76152729607c7615ae59b27d7615ae59b27e7615e7cb557f7615e7cb55807615e7cb55817615e7cb55827615ae59b2837615ae59b28476152729607a77142729607b7714ae59b27c7714e7cb557d7714e7cb557e77142729607f7714272960807714272960817714272960827714e7cb55837714e7cb55847714ae59b28577142729607978132729607a78138e4a9d7b7813d296437c78132729607d78132729607e7813ae93797f7813ae9379807813ae9379817813ae9379827813272960837813272960847813d296438578138e4a9d8678132729607879122729607979128e4a9d7a7912d296437b79122729607c7912ae93797d79122c333d7e79122c333d7f7912dacbb0807912dacbb08179122c333d8279122c333d837912ae9379847912272960857912d296438679128e4a9d877912272960787a11272960797a11d296437a7a112729607b7a11ae93797c7a112c333d7d7a11ffffff7e7a11ffffff7f7a112c333d807a112c333d817a11ffffff827a11ffffff837a112c333d847a11ae9379857a11272960867a11d29643877a11272960787b10272960797b10d296437a7b102729607b7b102c333d7c7b10428a9b7d7b10ffffff7e7b10ffffff7f7b102c333d807b102c333d817b10ffffff827b10ffffff837b10428a9b847b102c333d857b10272960867b10d29643877b10272960787c0f272960797c0fd296437a7c0f8e4a9d7b7c0fae93797c7c0fcab89d7d7c0f428a9b7e7c0f428a9b7f7c0f63a9a4807c0f63a9a4817c0f428a9b827c0f428a9b837c0fcab89d847c0fae9379857c0f8e4a9d867c0fd29643877c0f272960787d0e272960797d0e8e4a9d7a7d0eb96b337b7d0eae93797c7d0eae93797d7d0e63a9a47e7d0edacbb07f7d0ef0e8cc807d0ef0e8cc817d0edacbb0827d0e63a9a4837d0eae9379847d0eae9379857d0ed29643867d0e8e4a9d877d0e272960797e0d2729607a7e0db96b337b7e0d2c333d7c7e0dae93797d7e0dcab89d7e7e0ddacbb07f7e0ddacbb0807e0ddacbb0817e0ddacbb0827e0dcab89d837e0dae9379847e0d2c333d857e0db96b33867e0d2729607a7f0c2729607b7f0c2729607c7f0c2c333d7d7f0cae93797e7f0ccab89d7f7f0cdacbb0807f0cdacbb0817f0ccab89d827f0cae9379837f0c2c333d847f0c272960857f0c2729607a800b2729607b800b6a3a867c800b6a3a867d800bae93797e800bcab89d7f800bcab89d80800bcab89d81800bcab89d82800bae937983800b6a3a8684800b6a3a8685800b27296079810a2729607a810a6a3a867b810a6a3a867c810ad296437d810a6a3a867e810aae93797f810aae937980810aae937981810aae937982810a6a3a8683810ad2964384810a6a3a8685810a6a3a8686810a2729607982094a2b717a820990388a7b820990388a7c82094a2b717d82094a2b717e82092729607f8209705a58808209705a588182092729608282094a2b718382094a2b7184820990388a85820990388a8682094a2b717983084a2b717a830890388a7b830890388a7c830890388a7d830890388a7e83084a2b717f8308705a58808308705a588183084a2b7182830890388a83830890388a84830890388a85830890388a8683084a2b717984072729607a84074a2b717b84074a2b717c84074a2b717d84072729607e84074a2b717f8407705a58808407705a588184074a2b718284072729608384074a2b718484074a2b718584074a2b718684072729607a85062729607b85062729607c85062729607d8506705a587e8506705a587f8506272960808506272960818506705a58828506705a588385062729608485062729608585062729607c86052c333d7d8605ae93797e8605ae93797f86052c333d8086052c333d818605ae9379828605ae93798386052c333d7d87042c333d7e87042c333d8187042c333d8287042c333d");
    const Mons$Assets$char$battle_mage_d = Image3D$parse$("776f07272960786f07272960796f072729607a6f07272960757007272960767007272960777007ae59b2787007ae59b2797007ae59b27a7007ae59b27b70072729607c70072729607d70072729607e7007272960747107272960757107ae59b2767107ae59b27771078e4a9d787107ae59b2797107ae59b27a7107ae59b27b7107ae59b27c7107ae59b27d7107ae59b27e7107ae59b27f71072729608071072729608171072729608271072729607372072729607472078e4a9d757207e7cb55767207e7cb55777207e7cb55787207e7cb55797207e7cb557a7207e7cb557b7207ae59b27c7207ae59b27d7207ae59b27e7207ae59b27f7207ae59b28072078e4a9d817207ae59b28272078e4a9d8372072729608472072729607273072729607373078e4a9d747307e7cb557573072729607673072729607773072729607873072729607973078e4a9d7a73078e4a9d7b7307e7cb557c7307e7cb557d7307e7cb557e7307ae59b27f7307ae59b2807307ae59b2817307ae59b2827307ae59b2837307ae59b2847307ae59b28573072729608673072729608773072729608873072729607174072729607274078e4a9d737407e7cb557474072729607574072c333d7674072c333d7774072c333d7874072c333d7974072729607a74072729607b74078e4a9d7c7407ae59b27d7407ae59b27e7407e7cb557f7407e7cb558074078e4a9d817407ae59b28274078e4a9d837407ae59b28474078e4a9d857407ae59b28674078e4a9d8774078e4a9d8874078e4a9d8974072729607075072729607175078e4a9d727507d296437375072729607475072c333d7575072c333d7675072c333d7775072c333d7875072c333d7975072c333d7a75072c333d7b75072729607c75072729607d75072729607e7507ae59b27f7507e7cb55807507d29643817507ae59b2827507ae59b28375078e4a9d847507ae59b28575078e4a9d867507ae59b28775078e4a9d8875078e4a9d8975078e4a9d8a75072729608b75072729606f76072729607076078e4a9d717607d296437276072729607376072c333d7476072c333d7576072c333d7676072c333d7776072c333d7876072c333d7976072c333d7a76072c333d7b76072c333d7c76072c333d7d76072c333d7e76072729607f76078e4a9d807607d29643817607d296438276078e4a9d837607ae59b28476078e4a9d8576078e4a9d8676078e4a9d8776078e4a9d8876078e4a9d8976078e4a9d8a76078e4a9d8b76078e4a9d8c76072729606e77072729606f77078e4a9d707707d296437177072729607277072c333d737707bba38a747707bba38a7577072c333d7677072c333d7777072c333d787707ae9379797707ae93797a7707ae93797b77072c333d7c77072c333d7d77072c333d7e77072c333d7f77072729608077078e4a9d817707d29643827707d296438377078e4a9d8477078e4a9d8577078e4a9d8677078e4a9d8777078e4a9d8877078e4a9d8977078e4a9d8a77078e4a9d8b77078e4a9d8c77072729606d78072729606e78078e4a9d6f7807d296437078072729607178072c333d727807dacbb0737807bba38a747807bba38a7578072c333d7678072c333d777807bba38a787807bba38a797807ae93797a7807ae93797b78072c333d7c78072c333d7d78072c333d7e7807bba38a7f7807bba38a8078072729608178078e4a9d827807d29643837807d296438478078e4a9d8578078e4a9d8678078e4a9d8778078e4a9d8878078e4a9d8978078e4a9d8a78078e4a9d8b78078e4a9d8c78078e4a9d8d78072729606d79072729606e7907d296436f79072729607079072c333d717907dacbb0727907bba38a737907bba38a7479072c333d7579072c333d7679072c333d777907bba38a787907bba38a797907ae93797a79072c333d7b79072c333d7c79072c333d7d79072c333d7e7907bba38a7f7907bba38a807907dacbb08179072729608279078e4a9d837907d29643847907d296438579078e4a9d8679078e4a9d8779078e4a9d8879076a3a868979078e4a9d8a79076a3a868b79078e4a9d8c79076a3a868d79072729606c7a072729606d7a078e4a9d6e7a07d296436f7a07272960707a07dacbb0717a07dacbb0727a07bba38a737a072c333d747a072c333d757a072c333d767a072c333d777a07ae9379787a07ae9379797a072c333d7a7a072c333d7b7a072c333d7c7a072c333d7d7a072c333d7e7a072c333d7f7a07dacbb0807a07bba38a817a07dacbb0827a07272960837a078e4a9d847a07d29643857a07d29643867a07d29643877a078e4a9d887a078e4a9d897a076a3a868a7a078e4a9d8b7a076a3a868c7a078e4a9d8d7a076a3a868e7a072729606c7b072729606d7b07b96b336e7b072729606f7b072c333d707b07dacbb0717b07dacbb0727b07bba38a737b072c333d747b072c333d757b07ffffff767b07ffffff777b072c333d787b072c333d797b072c333d7a7b072c333d7b7b072c333d7c7b07ffffff7d7b07ffffff7e7b072c333d7f7b07dacbb0807b07dacbb0817b07dacbb0827b07dacbb0837b07272960847b078e4a9d857b078e4a9d867b07d29643877b07d29643887b076a3a86897b078e4a9d8a7b076a3a868b7b076a3a868c7b076a3a868d7b076a3a868e7b072729606b7c072729606c7c078e4a9d6d7c07b96b336e7c072729606f7c072c333d707c07dacbb0717c07bba38a727c07bba38a737c072c333d747c072c333d757c07ffffff767c07ffffff777c07428a9b787c07428a9b797c072c333d7a7c072c333d7b7c072c333d7c7c07ffffff7d7c07ffffff7e7c072c333d7f7c07428a9b807c07f0e8cc817c07dacbb0827c07f0e8cc837c07dacbb0847c07272960857c07272960867c078e4a9d877c07d29643887c07b96b33897c076a3a868a7c076a3a868b7c076a3a868c7c076a3a868d7c076a3a868e7c072729606b7d072729606c7d07b96b336d7d072729606e7d072c333d6f7d07dacbb0707d07bba38a717d07bba38a727d07bba38a737d072c333d747d072c333d757d072c333d767d072c333d777d0763a9a4787d0763a9a4797d07428a9b7a7d072c333d7b7d072c333d7c7d072c333d7d7d072c333d7e7d07428a9b7f7d0763a9a4807d0763a9a4817d07f0e8cc827d07dacbb0837d07f0e8cc847d07dacbb0857d07dacbb0867d07272960877d078e4a9d887d07b96b33897d07b96b338a7d076a3a868b7d076a3a868c7d076a3a868d7d076a3a868e7d072729606a7e072729606b7e078e4a9d6c7e07b96b336d7e072729606e7e072c333d6f7e07bba38a707e07dacbb0717e07bba38a727e07bba38a737e072c333d747e072c333d757e072c333d767e0763a9a4777e0763a9a4787e0763a9a4797e07428a9b7a7e07428a9b7b7e07428a9b7c7e07428a9b7d7e07428a9b7e7e0763a9a47f7e0763a9a4807e0763a9a4817e07dacbb0827e07f0e8cc837e07dacbb0847e07f0e8cc857e07f0e8cc867e07dacbb0877e07272960887e076a3a86897e07b96b338a7e076a3a868b7e076a3a868c7e076a3a868d7e076a3a868e7e072729606a7f072729606b7f07b96b336c7f072729606d7f072c333d6e7f07bba38a6f7f07dacbb0707f07bba38a717f07bba38a727f07428a9b737f07f0e8cc747f07f0e8cc757f072c333d767f07428a9b777f07428a9b787f07428a9b797f072c333d7a7f07f0e8cc7b7f07f0e8cc7c7f07f0e8cc7d7f07428a9b7e7f0763a9a47f7f0763a9a4807f07428a9b817f07dacbb0827f07dacbb0837f07f0e8cc847f07f0e8cc857f07f0e8cc867f07f0e8cc877f07dacbb0887f07272960897f076a3a868a7f07b96b338b7f076a3a868c7f076a3a868d7f076a3a868e7f072729606a80072729606b8007b96b336c80072729606d80072c333d6e8007bba38a6f8007bba38a708007bba38a718007bba38a728007428a9b738007f0e8cc748007f0e8cc758007dacbb07680072c333d7780072c333d7880072c333d798007dacbb07a8007f0e8cc7b8007f0e8cc7c8007f0e8cc7d8007f0e8cc7e8007f0e8cc7f8007428a9b808007428a9b818007dacbb0828007dacbb0838007dacbb0848007f0e8cc858007f0e8cc868007f0e8cc878007dacbb08880072729608980076a3a868a8007b96b338b80076a3a868c80076a3a868d80076a3a868e80072729606a81072729606b8107b96b336c81072729606d81072c333d6e81072c333d6f8107bba38a708107bba38a7181072c333d728107f0e8cc738107f0e8cc748107f0e8cc758107dacbb0768107dacbb07781072c333d7881072c333d798107dacbb07a8107dacbb07b8107f0e8cc7c8107f0e8cc7d8107dacbb07e8107f0e8cc7f8107dacbb0808107a5876e818107dacbb0828107dacbb0838107dacbb0848107dacbb0858107dacbb0868107dacbb0878107dacbb08881072729608981076a3a868a8107b96b338b81076a3a868c81076a3a868d81076a3a868e81072729606a82072729606b8207b96b336c82072729606d82072c333d6e82072c333d6f82072c333d7082072c333d718207f0e8cc728207dacbb0738207f0e8cc748207dacbb0758207dacbb0768207dacbb0778207a5876e788207bba38a798207a5876e7a8207dacbb07b8207dacbb07c8207f0e8cc7d8207f0e8cc7e8207dacbb07f8207f0e8cc808207dacbb0818207a5876e828207dacbb08382072c333d848207dacbb0858207dacbb0868207dacbb0878207dacbb08882072729608982076a3a868a8207b96b338b82076a3a868c82076a3a868d82072729606a83072729606b83078e4a9d6c8307b96b336d83072729606e83072c333d6f83072c333d7083072c333d718307dacbb0728307f0e8cc738307dacbb0748307dacbb0758307dacbb0768307a5876e778307dacbb0788307dacbb0798307dacbb07a8307a5876e7b8307dacbb07c8307dacbb07d8307dacbb07e8307dacbb07f8307dacbb0808307dacbb0818307a5876e828307bba38a8383072c333d8483072c333d8583072c333d8683072c333d8783072c333d8883072729608983076a3a868a8307b96b338b83076a3a868c83076a3a868d83072729606b84072729606c8407b96b336d84072729606e84072c333d6f84072c333d7084072c333d718407bba38a728407dacbb0738407dacbb0748407a5876e758407a5876e768407dacbb0778407dacbb0788407dacbb0798407dacbb07a8407dacbb07b8407a5876e7c8407a5876e7d8407a5876e7e8407a5876e7f8407a5876e808407a5876e818407bba38a828407bba38a8384072c333d8484072c333d8584072c333d8684072c333d8784072c333d8884072729608984076a3a868a8407b96b338b84076a3a868c84076a3a868d84072729606b85072729606c8507b96b336d85072729606e85072c333d6f85072c333d7085072c333d7185072c333d7285072c333d738507bba38a748507bba38a758507dacbb0768507dacbb0778507dacbb0788507f0e8cc798507dacbb07a8507dacbb07b8507dacbb07c8507bba38a7d8507dacbb07e8507bba38a7f8507bba38a808507bba38a818507bba38a828507bba38a8385072c333d8485072c333d8585072c333d8685072c333d8785072c333d888507272960898507b96b338a85076a3a868b85076a3a868c85076a3a868d85072729606b86072729606c8607b96b336d86072729606e86072c333d6f86072c333d7086072c333d7186072c333d7286072c333d738607bba38a748607dacbb0758607dacbb0768607dacbb0778607dacbb0788607dacbb0798607dacbb07a8607dacbb07b8607dacbb07c8607dacbb07d8607bba38a7e8607dacbb07f8607bba38a808607bba38a818607bba38a828607bba38a8386072c333d8486072c333d8586072c333d8686072c333d8786072c333d888607272960898607b96b338a86076a3a868b86076a3a868c86076a3a868d86072729608e86072729606c87072729606d8707b96b336e87072729606f87072c333d7087072c333d7187072c333d728707272960738707dacbb0748707dacbb0758707dacbb0768707f0e8cc778707dacbb0788707f0e8cc798707dacbb07a8707dacbb07b8707dacbb07c8707dacbb07d8707dacbb07e8707bba38a7f8707dacbb0808707bba38a818707bba38a828707bba38a8387072c333d8487072c333d8587072c333d8687072c333d878707272960888707b96b338987076a3a868a87076a3a868b87076a3a868c87076a3a868d87078e4a9d8e8707ae59b28f87072729606d88072729606e8807b96b336f88072729607088072c333d7188072c333d728807dacbb0738807dacbb0748807dacbb0758807f0e8cc768807dacbb0778807f0e8cc788807dacbb0798807f0e8cc7a8807dacbb07b8807dacbb07c8807dacbb07d8807dacbb07e8807dacbb07f8807bba38a808807bba38a818807bba38a828807bba38a8388072c333d8488072c333d8588072c333d8688072c333d878807272960888807b96b338988076a3a868a88076a3a868b88078e4a9d8c8807ae59b28d8807ae59b28e8807ae59b28f8807ae59b29088072729606c89072729606d89072729606e89076a3a866f89072729607089072c333d718907dacbb0728907dacbb0738907dacbb0748907f0e8cc758907f0e8cc768907f0e8cc778907f0e8cc788907f0e8cc798907dacbb07a8907dacbb07b8907dacbb07c8907dacbb07d8907dacbb07e8907bba38a7f8907dacbb0808907bba38a818907bba38a8289072c333d8389072c333d8489072c333d858907272960868907272960878907b96b338889076a3a868989078e4a9d8a89078e4a9d8b8907ae59b28c8907ae59b28d8907ae59b28e8907ae59b28f8907ae59b2908907ae59b29189072729606b8a072729606c8a074a2b716d8a076a3a866e8a078e4a9d6f8a078e4a9d708a072c333d718a07dacbb0728a07dacbb0738a07f0e8cc748a07f0e8cc758a07f0e8cc768a07f0e8cc778a07f0e8cc788a07dacbb0798a07dacbb07a8a07dacbb07b8a07dacbb07c8a07dacbb07d8a07dacbb07e8a07dacbb07f8a07bba38a808a07bba38a818a07bba38a828a072c333d838a07272960848a07272960858a078e4a9d868a07b96b33878a078e4a9d888a078e4a9d898a078e4a9d8a8a078e4a9d8b8a07ae59b28c8a078e4a9d8d8a07ae59b28e8a07ae59b28f8a07ae59b2908a078e4a9d918a072729606a8b072729606b8b076a3a866c8b074a2b716d8b076a3a866e8b078e4a9d6f8b078e4a9d708b072c333d718b07dacbb0728b07dacbb0738b07f0e8cc748b07f0e8cc758b07f0e8cc768b07f0e8cc778b07f0e8cc788b07f0e8cc798b07dacbb07a8b07dacbb07b8b07dacbb07c8b07dacbb07d8b07dacbb07e8b07dacbb07f8b07dacbb0808b07bba38a818b07bba38a828b07272960838b078e4a9d848b078e4a9d858b078e4a9d868b078e4a9d878b078e4a9d888b078e4a9d898b078e4a9d8a8b07ae59b28b8b078e4a9d8c8b07ae59b28d8b07ae59b28e8b07ae59b28f8b078e4a9d908b078e4a9d918b078e4a9d928b07272960698c072729606a8c078e4a9d6b8c076a3a866c8c074a2b716d8c078e4a9d6e8c078e4a9d6f8c078e4a9d708c072c333d718c07dacbb0728c07dacbb0738c07f0e8cc748c07f0e8cc758c07f0e8cc768c07f0e8cc778c07f0e8cc788c07f0e8cc798c07dacbb07a8c07dacbb07b8c07dacbb07c8c07dacbb07d8c07dacbb07e8c07dacbb07f8c07bba38a808c07bba38a818c072c333d828c075f3538838c075f3538848c075f3538858c075f3538868c078e4a9d878c078e4a9d888c078e4a9d898c078e4a9d8a8c078e4a9d8b8c07ae59b28c8c078e4a9d8d8c07ae59b28e8c078e4a9d8f8c078e4a9d908c076a3a86918c074a2b71928c07272960938c07272960698d072729606a8d078e4a9d6b8d078e4a9d6c8d074a2b716d8d078e4a9d6e8d078e4a9d6f8d078e4a9d708d072c333d718d07dacbb0728d07dacbb0738d07dacbb0748d07f0e8cc758d07f0e8cc768d07f0e8cc778d07f0e8cc788d07dacbb0798d07dacbb07a8d07dacbb07b8d07dacbb07c8d07dacbb07d8d07dacbb07e8d07bba38a7f8d07bba38a808d072c333d818d075f3538828d07d29643838d07d29643848d07d29643858d07e7cb55868d075f3538878d078e4a9d888d078e4a9d898d078e4a9d8a8d07ae59b28b8d078e4a9d8c8d07ae59b28d8d078e4a9d8e8d078e4a9d8f8d076a3a86908d074a2b71918d078e4a9d928d078e4a9d938d076a3a86948d07272960688e07272960698e078e4a9d6a8e078e4a9d6b8e078e4a9d6c8e074a2b716d8e078e4a9d6e8e078e4a9d6f8e078e4a9d708e072c333d718e07dacbb0728e07dacbb0738e07dacbb0748e07dacbb0758e07dacbb0768e07dacbb0778e07dacbb0788e07dacbb0798e07dacbb07a8e07dacbb07b8e07dacbb07c8e07dacbb07d8e07dacbb07e8e07bba38a7f8e072c333d808e075f3538818e07cc833c828e07d29643838e07b96b33848e07b96b33858e07d29643868e07e7cb55878e075f3538888e078e4a9d898e078e4a9d8a8e078e4a9d8b8e078e4a9d8c8e078e4a9d8d8e078e4a9d8e8e076a3a868f8e074a2b71908e078e4a9d918e078e4a9d928e078e4a9d938e07ae59b2948e07ae59b2958e07272960688f07272960698f078e4a9d6a8f078e4a9d6b8f078e4a9d6c8f076a3a866d8f078e4a9d6e8f078e4a9d6f8f075f3538708f07e7cb55718f072c333d728f07bba38a738f07dacbb0748f07bba38a758f07dacbb0768f07dacbb0778f07dacbb0788f07dacbb0798f07dacbb07a8f07dacbb07b8f07dacbb07c8f07dacbb07d8f07bba38a7e8f072c333d7f8f07272960808f075f3538818f07cc833c828f07e7cb55838f07d29643848f07b96b33858f07b96b33868f07d29643878f075f3538888f078e4a9d898f078e4a9d8a8f078e4a9d8b8f078e4a9d8c8f078e4a9d8d8f076a3a868e8f074a2b718f8f076a3a86908f078e4a9d918f078e4a9d928f07ae59b2938f07ae59b2948f07ae59b2958f07ae59b2968f072729606790072729606890076a3a866990078e4a9d6a90078e4a9d6b90078e4a9d6c90076a3a866d90078e4a9d6e90078e4a9d6f90075f3538709007e7cb557190072c333d729007bba38a739007bba38a749007dacbb0759007bba38a769007dacbb0779007bba38a789007dacbb0799007bba38a7a9007bba38a7b9007bba38a7c9007bba38a7d90072c333d7e90074a2b717f90072729608090075f3538819007cc833c829007e7cb55839007d29643849007d29643859007b96b33869007d296438790075f35388890078e4a9d8990078e4a9d8a90078e4a9d8b90078e4a9d8c90076a3a868d90074a2b718e90076a3a868f90076a3a869090078e4a9d9190078e4a9d9290078e4a9d939007ae59b29490078e4a9d959007ae59b2969007ae59b29790072729606791072729606891078e4a9d6991078e4a9d6a91078e4a9d6b91078e4a9d6c91076a3a866d91078e4a9d6e91078e4a9d6f91075f3538709107d29643719107b96b337291072c333d7391072c333d749107bba38a759107bba38a769107bba38a779107bba38a789107bba38a799107bba38a7a91072c333d7b91072c333d7c91072c333d7d91074a2b717e91074a2b717f91072729608091075f3538819107cc833c829107cc833c839107e7cb55849107e7cb55859107d29643869107d296438791075f35388891078e4a9d8991078e4a9d8a91076a3a868b91076a3a868c91076a3a868d91076a3a868e91076a3a868f91078e4a9d9091078e4a9d9191078e4a9d9291078e4a9d9391078e4a9d949107ae59b29591078e4a9d9691078e4a9d9791076a3a869891072729606692072729606792076a3a866892078e4a9d6992078e4a9d6a92078e4a9d6b92078e4a9d6c92076a3a866d92074a2b716e92078e4a9d6f92075f3538709207d29643719207b96b33729207b96b33739207cc833c7492072c333d7592072c333d7692072c333d7792072c333d7892072c333d7992072c333d7a9207705a587b9207705a587c92074a2b717d92074a2b717e92074a2b717f92072729608092078e4a9d8192075f3538829207cc833c839207cc833c849207cc833c859207cc833c8692075f35388792076a3a868892078e4a9d8992076a3a868a92076a3a868b92076a3a868c92076a3a868d92076a3a868e92078e4a9d8f92078e4a9d9092078e4a9d9192078e4a9d9292078e4a9d9392078e4a9d9492078e4a9d9592078e4a9d9692073421639792073421639892072729606693072729606793073421636893078e4a9d6993078e4a9d6a93078e4a9d6b93078e4a9d6c93076a3a866d93074a2b716e93078e4a9d6f93078e4a9d7093075f3538719307d29643729307cc833c739307cc833c7493075f35387593072729607693074a2b71779307705a58789307705a58799307705a587a9307705a587b93074a2b717c93074a2b717d93074a2b717e93074a2b717f93072729608093078e4a9d8193078e4a9d8293075f35388393075f35388493075f35388593075f35388693076a3a868793078e4a9d8893072729608993072729608a93076a3a868b93076a3a868c93078e4a9d8d93078e4a9d8e93078e4a9d8f93078e4a9d9093078e4a9d9193078e4a9d929307342163939307342163949307342163959307342163969307762a7c97930790388a989307762a7c999307272960659407272960669407762a7c679407762a7c6894073421636994073421636a94078e4a9d6b94078e4a9d6c94078e4a9d6d94076a3a866e94072729606f94078e4a9d7094078e4a9d7194075f35387294075f35387394075f35387494072729607594074a2b717694076a3a86779407705a58789407705a58799407705a587a94076a3a867b94074a2b717c94074a2b717d94074a2b717e94074a2b717f94074a2b718094072729608194078e4a9d8294078e4a9d8394078e4a9d8494078e4a9d8594078e4a9d869407272960879407272960889407762a7c899407762a7c8a94073421638b94073421638c94073421638d94073421638e94073421638f940734216390940734216391940734216392940790388a939407762a7c949407762a7c959407762a7c96940790388a979407762a7c98940790388a999407762a7c9a9407272960649507272960659507762a7c669507762a7c679507762a7c689507762a7c699507762a7c6a95073421636b95073421636c95073421636d95073421636e950790388a6f95072729607095072729607195072729607295072729607395074a2b717495074a2b717595076a3a867695076a3a86779507705a58789507705a58799507705a587a95074a2b717b95074a2b717c95074a2b717d95074a2b717e95074a2b717f95074a2b71809507272960819507272960829507272960839507272960849507272960859507272960869507762a7c879507762a7c88950790388a89950790388a8a950790388a8b950790388a8c950790388a8d950790388a8e950790388a8f950790388a90950790388a91950790388a92950790388a93950790388a94950790388a959507762a7c969507762a7c979507762a7c989507762a7c999507762a7c9a9507762a7c9b9507272960649607272960659607762a7c669607762a7c679607762a7c689607762a7c699607762a7c6a9607762a7c6b9607762a7c6c9607d296436d9607d296436e960790388a6f96072729607096074a2b717196074a2b717296074a2b717396074a2b717496076a3a867596076a3a86769607705a58779607705a58789607705a58799607705a587a96074a2b717b96074a2b717c96074a2b717d96074a2b717e96074a2b717f96074a2b7180960727296081960790388a82960790388a839607d29643849607d29643859607d2964386960790388a87960790388a88960790388a89960790388a8a960790388a8b960790388a8c960790388a8d960790388a8e960790388a8f960790388a90960790388a91960790388a92960790388a93960790388a94960790388a95960790388a969607762a7c979607762a7c989607762a7c999607762a7c9a960790388a9b9607272960639707272960649707762a7c659707762a7c669707762a7c679707762a7c689707762a7c699707762a7c6a9707762a7c6b970790388a6c9707d296436d9707d296436e970790388a6f97072729607097074a2b717197074a2b717297074a2b717397076a3a867497076a3a867597076a3a86769707705a58779707816a65789707705a587997076a3a867a97074a2b717b97074a2b717c97074a2b717d97074a2b717e97074a2b717f970727296080970790388a81970790388a829707d29643839707d29643849707e7cb5585970790388a86970790388a87970790388a889707ac499989970790388a8a9707ac49998b970790388a8c970790388a8d970790388a8e970790388a8f970790388a90970790388a91970790388a92970790388a93970790388a94970790388a95970790388a96970790388a979707762a7c989707762a7c999707762a7c9a9707762a7c9b9707762a7c9c9707272960639807272960649807762a7c659807762a7c669807762a7c67980790388a689807762a7c69980790388a6a9807762a7c6b9807e7cb556c9807d296436d9807d296436e980790388a6f98072729607098074a2b717198074a2b717298074a2b717398076a3a867498076a3a867598076a3a86769807816a65779807705a58789807816a657998076a3a867a98074a2b717b98074a2b717c98074a2b717d98074a2b717e98074a2b717f980727296080980790388a81980790388a829807e7cb55839807e7cb55849807e7cb5585980790388a86980790388a87980790388a88980790388a899807ac49998a980790388a8b9807ac49998c980790388a8d980790388a8e980790388a8f980790388a90980790388a91980790388a92980790388a93980790388a94980790388a95980790388a96980790388a97980790388a989807762a7c999807762a7c9a980790388a9b9807762a7c9c9807272960629907272960639907762a7c64990790388a659907762a7c66990790388a679907762a7c68990790388a699907762a7c6a990790388a6b9907d296436c9907e7cb556d990790388a6e99072729606f99074a2b717099074a2b717199074a2b717299074a2b717399076a3a867499076a3a867599076a3a86769907816a65779907816a65789907705a587999076a3a867a99074a2b717b99074a2b717c99074a2b717d99074a2b717e99074a2b717f990727296080990790388a81990790388a829907e7cb55839907e7cb5584990790388a85990790388a86990790388a87990790388a88990790388a89990790388a8a9907ac49998b9907ac49998c9907ac49998d990790388a8e990790388a8f990790388a90990790388a91990790388a92990790388a93990790388a94990790388a95990790388a96990790388a97990790388a98990790388a999907762a7c9a9907762a7c9b9907762a7c9c9907762a7c9d9907272960629a07272960639a07762a7c649a07762a7c659a0790388a669a07762a7c679a0790388a689a0790388a699a0790388a6a9a07e7cb556b9a07e7cb556c9a07e7cb556d9a0790388a6e9a072729606f9a074a2b71709a074a2b71719a074a2b71729a074a2b71739a074a2b71749a076a3a86759a076a3a86769a07816a65779a07816a65789a07816a65799a07816a657a9a076a3a867b9a074a2b717c9a074a2b717d9a074a2b717e9a074a2b717f9a07272960809a0790388a819a0790388a829a07e7cb55839a07e7cb55849a0790388a859a0790388a869a0790388a879a0790388a889a0790388a899a07ac49998a9a0790388a8b9a07ac49998c9a07ac49998d9a07ac49998e9a0790388a8f9a0790388a909a07762a7c919a0790388a929a0790388a939a0790388a949a0790388a959a0790388a969a0790388a979a0790388a989a0790388a999a07762a7c9a9a07762a7c9b9a07762a7c9c9a07762a7c9d9a07272960629b07272960639b07762a7c649b0790388a659b07762a7c669b0790388a679b0790388a689b0790388a699b0790388a6a9b07e7cb556b9b07e7cb556c9b0790388a6d9b0790388a6e9b072729606f9b074a2b71709b074a2b71719b074a2b71729b074a2b71739b076a3a86749b076a3a86759b076a3a86769b076a3a86779b07816a65789b07816a65799b07816a657a9b076a3a867b9b074a2b717c9b074a2b717d9b074a2b717e9b074a2b717f9b074a2b71809b07272960819b0790388a829b07d29643839b07d29643849b07d29643859b07d29643869b0790388a879b0790388a889b0790388a899b0790388a8a9b07ac49998b9b07ac49998c9b07ac49998d9b07ac49998e9b0790388a8f9b07762a7c909b0790388a919b07762a7c929b07762a7c939b0790388a949b0790388a959b0790388a969b0790388a979b0790388a989b07762a7c999b07762a7c9a9b07762a7c9b9b07762a7c9c9b07762a7c9d9b07272960619c07272960629c07762a7c639c07762a7c649c07762a7c659c0790388a669c0790388a679c0790388a689c07d29643699c07d296436a9c07e7cb556b9c07e7cb556c9c0790388a6d9c0790388a6e9c072729606f9c074a2b71709c074a2b71719c074a2b71729c074a2b71739c074a2b71749c076a3a86759c076a3a86769c076a3a86779c07816a65789c07816a65799c07816a657a9c07816a657b9c076a3a867c9c074a2b717d9c074a2b717e9c074a2b717f9c074a2b71809c07272960819c0790388a829c0790388a839c07d29643849c07d29643859c07b96b33869c07b96b33879c07b96b33889c0790388a899c0790388a8a9c0790388a8b9c07ac49998c9c07ac49998d9c07ac49998e9c0790388a8f9c0790388a909c07762a7c919c07762a7c929c07762a7c939c07762a7c949c0790388a959c0790388a969c0790388a979c0790388a989c0790388a999c07762a7c9a9c07762a7c9b9c07762a7c9c9c07762a7c9d9c07272960619d07272960629d07762a7c639d07762a7c649d0790388a659d0790388a669d0790388a679d07d29643689d07d29643699d07d296436a9d07d296436b9d0790388a6c9d0790388a6d9d072729606e9d074a2b716f9d074a2b71709d074a2b71719d076a3a86729d074a2b71739d076a3a86749d074a2b71759d076a3a86769d076a3a86779d07816a65789d07816a65799d07816a657a9d07816a657b9d076a3a867c9d074a2b717d9d074a2b717e9d074a2b717f9d074a2b71809d074a2b71819d07272960829d0790388a839d0790388a849d07b96b33859d07d29643869d07b96b33879d07b96b33889d07b96b33899d07b96b338a9d0790388a8b9d0790388a8c9d07ac49998d9d07ac49998e9d0790388a8f9d07762a7c909d0790388a919d07762a7c929d07762a7c939d07762a7c949d07762a7c959d0790388a969d0790388a979d0790388a989d07762a7c999d07762a7c9a9d07762a7c9b9d07762a7c9c9d07762a7c9d9d07762a7c9e9d07272960609e07272960619e07762a7c629e07762a7c639e0790388a649e0790388a659e07b96b33669e07b96b33679e07b96b33689e07d29643699e07d296436a9e0790388a6b9e0790388a6c9e072729606d9e074a2b716e9e074a2b716f9e074a2b71709e076a3a86719e074a2b71729e076a3a86739e074a2b71749e076a3a86759e076a3a86769e076a3a86779e07816a65789e07816a65799e07816a657a9e07816a657b9e076a3a867c9e076a3a867d9e074a2b717e9e074a2b717f9e074a2b71809e074a2b71819e074a2b71829e07272960839e0790388a849e0790388a859e0790388a869e0790388a879e07b96b33889e07d29643899e07b96b338a9e07d296438b9e0790388a8c9e0790388a8d9e0790388a8e9e0790388a8f9e0790388a909e07762a7c919e07762a7c929e07762a7c939e07762a7c949e07762a7c959e07762a7c969e0790388a979e07762a7c989e0790388a999e07762a7c9a9e07762a7c9b9e07762a7c9c9e07762a7c9d9e07762a7c9e9e07272960");
    const Mons$Skill$hit_4 = ({
        _: 'Mons.Skill.hit_4'
    });
    const Mons$Skill$hit_2 = ({
        _: 'Mons.Skill.hit_2'
    });
    const Mons$Skill$heal = ({
        _: 'Mons.Skill.heal'
    });
    const Mons$Skill$dummy_skills = List$cons$(Mons$Skill$hit_4, List$cons$(Mons$Skill$hit_2, List$cons$(Mons$Skill$heal, List$cons$(Mons$Skill$none, List$nil))));
    const Mons$Attr$new_mage = Mons$Attr$new$(Bool$false, 40, 0, "MAGE", Mons$Kind$set_static_sprites(List$cons$(Mons$Assets$char$mons_mage, List$nil)), List$cons$(Mons$Assets$char$mons_mage, List$nil), Mons$Assets$char$mons_mage, (_is_up$1 => {
        var $517 = Mons$Assets$char$battle_mage_d;
        return $517;
    }), Mons$Skill$dummy_skills, Mons$image_to_global$(74, 74, 40, 12, 0));
    const Image3D$empty = Image3D$alloc_capacity$(100);

    function Mons$Kind$set_pic$(_spr$1) {
        var self = _spr$1;
        switch (self._) {
            case 'List.cons':
                var $519 = self.head;
                var $520 = $519;
                var $518 = $520;
                break;
            case 'List.nil':
                var $521 = Image3D$empty;
                var $518 = $521;
                break;
        };
        return $518;
    };
    const Mons$Kind$set_pic = x0 => Mons$Kind$set_pic$(x0);

    function Mons$Kind$set_default_battle_spr$(_is_up$1) {
        var $522 = Image3D$empty;
        return $522;
    };
    const Mons$Kind$set_default_battle_spr = x0 => Mons$Kind$set_default_battle_spr$(x0);

    function Mons$Attr$new_neutral$(_spr$1) {
        var $523 = Mons$Attr$new$(Bool$false, 0, 0, "", Mons$Kind$set_static_sprites(_spr$1), _spr$1, Mons$Kind$set_pic$(_spr$1), Mons$Kind$set_default_battle_spr, List$nil, Mons$global_scr_mid);
        return $523;
    };
    const Mons$Attr$new_neutral = x0 => Mons$Attr$new_neutral$(x0);

    function Mons$Kind$attr$(_kin$1) {
        var _default_pos$2 = Mons$global_scr_mid;
        var _set_pos_lvl1$3 = (_x$3 => _y$4 => {
            var $525 = Mons$image_to_global$(80, 80, _x$3, _y$4, 1);
            return $525;
        });
        var _set_pos_lvl2$4 = (_x$4 => _y$5 => {
            var $526 = Mons$image_to_global$(20, 20, _x$4, _y$5, 2);
            return $526;
        });
        var self = _kin$1;
        switch (self._) {
            case 'Mons.Kind.Mons':
                var $527 = self.ele;
                var self = $527;
                switch (self._) {
                    case 'Mons.Kind.mons.HERO':
                        var $529 = Mons$Attr$new_hero;
                        var $528 = $529;
                        break;
                    case 'Mons.Kind.mons.MAGE':
                        var $530 = Mons$Attr$new_mage;
                        var $528 = $530;
                        break;
                    case 'Mons.Kind.mons.BEHOLDER':
                    case 'Mons.Kind.mons.ZOIO':
                    case 'Mons.Kind.mons.CYCLOPE':
                    case 'Mons.Kind.mons.POISOLICK':
                    case 'Mons.Kind.mons.TROWL':
                    case 'Mons.Kind.mons.MIMIC':
                    case 'Mons.Kind.mons.MIMIC2':
                    case 'Mons.Kind.mons.AZULA':
                    case 'Mons.Kind.mons.EMERELDER':
                    case 'Mons.Kind.mons.EMERELDER2':
                        var $531 = Mons$Attr$new_neutral$(List$cons$(Image3D$empty, List$nil));
                        var $528 = $531;
                        break;
                };
                var $524 = $528;
                break;
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Terrain':
            case 'Mons.Kind.Interactive':
                var $532 = Mons$Attr$new_neutral$(List$cons$(Image3D$empty, List$nil));
                var $524 = $532;
                break;
        };
        return $524;
    };
    const Mons$Kind$attr = x0 => Mons$Kind$attr$(x0);

    function Mons$Object$get_ani$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $534 = self.ani;
                var $535 = $534;
                var $533 = $535;
                break;
        };
        return $533;
    };
    const Mons$Object$get_ani = x0 => Mons$Object$get_ani$(x0);

    function Mons$Object$is_standing$(_obj$1) {
        var $536 = (Mons$Object$get_ani$(_obj$1) === 0);
        return $536;
    };
    const Mons$Object$is_standing = x0 => Mons$Object$is_standing$(x0);

    function Image3D$get_length$(_img$1) {
        var self = _img$1;
        switch (self._) {
            case 'Image3D.new':
                var $538 = self.length;
                var $539 = $538;
                var $537 = $539;
                break;
        };
        return $537;
    };
    const Image3D$get_length = x0 => Image3D$get_length$(x0);

    function Array$get$(_idx$3, _arr$4) {
        var $540 = Word$foldl$(Array$extract_tip, (_rec$6 => _arr$7 => {
            var _arr_l$8 = Array$extract_tie$(_arr$7);
            var self = _arr_l$8;
            switch (self._) {
                case 'Pair.new':
                    var $542 = self.fst;
                    var $543 = _rec$6($542);
                    var $541 = $543;
                    break;
            };
            return $541;
        }), (_rec$6 => _arr$7 => {
            var _arr_r$8 = Array$extract_tie$(_arr$7);
            var self = _arr_r$8;
            switch (self._) {
                case 'Pair.new':
                    var $545 = self.snd;
                    var $546 = _rec$6($545);
                    var $544 = $546;
                    break;
            };
            return $544;
        }), _idx$3)(_arr$4);
        return $540;
    };
    const Array$get = x0 => x1 => Array$get$(x0, x1);
    const Buffer32$get = a0 => a1 => ((a1[a0]));
    const Image3D$get_pos = a0 => a1 => ((a1.buffer[a0 * 2]));
    const Image3D$get_col = a0 => a1 => ((a1.buffer[a0 * 2 + 1]));

    function Pos32$sub$(_a$1, _b$2) {
        var _a_x$3 = ((_a$1 & 0xFFF));
        var _a_y$4 = (((_a$1 >>> 12) & 0xFFF));
        var _a_z$5 = ((_a$1 >>> 24));
        var _b_x$6 = ((_b$2 & 0xFFF));
        var _b_y$7 = (((_b$2 >>> 12) & 0xFFF));
        var _b_z$8 = ((_b$2 >>> 24));
        var _c_x$9 = (Math.max(_a_x$3 - _b_x$6, 0));
        var _c_y$10 = (Math.max(_a_y$4 - _b_y$7, 0));
        var _c_z$11 = (Math.max(_a_z$5 - _b_z$8, 0));
        var $547 = ((0 | _c_x$9 | (_c_y$10 << 12) | (_c_z$11 << 24)));
        return $547;
    };
    const Pos32$sub = x0 => x1 => Pos32$sub$(x0, x1);

    function Pos32$add$(_a$1, _b$2) {
        var _a_x$3 = ((_a$1 & 0xFFF));
        var _a_y$4 = (((_a$1 >>> 12) & 0xFFF));
        var _a_z$5 = ((_a$1 >>> 24));
        var _b_x$6 = ((_b$2 & 0xFFF));
        var _b_y$7 = (((_b$2 >>> 12) & 0xFFF));
        var _b_z$8 = ((_b$2 >>> 24));
        var _c_x$9 = ((_a_x$3 + _b_x$6) >>> 0);
        var _c_y$10 = ((_a_y$4 + _b_y$7) >>> 0);
        var _c_z$11 = ((_a_z$5 + _b_z$8) >>> 0);
        var $548 = ((0 | _c_x$9 | (_c_y$10 << 12) | (_c_z$11 << 24)));
        return $548;
    };
    const Pos32$add = x0 => x1 => Pos32$add$(x0, x1);
    const Mons$vox_mid = ((0 | 128 | (128 << 12) | (0 << 24)));

    function Mons$draw$image$(_img$1, _pos$2, _scr$3) {
        var _len$4 = Image3D$get_length$(_img$1);
        var _scr$5 = (() => {
            var $550 = _scr$3;
            var $551 = 0;
            var $552 = _len$4;
            let _scr$6 = $550;
            for (let _i$5 = $551; _i$5 < $552; ++_i$5) {
                var _pix_pos$7 = ((_img$1.buffer[_i$5 * 2]));
                var _pix_col$8 = ((_img$1.buffer[_i$5 * 2 + 1]));
                var _pix_pos$9 = Pos32$sub$(Pos32$add$(_pos$2, _pix_pos$7), Mons$vox_mid);
                var $550 = ((_scr$6.buffer[_scr$6.length * 2] = _pix_pos$9, _scr$6.buffer[_scr$6.length * 2 + 1] = _pix_col$8, _scr$6.length++, _scr$6));
                _scr$6 = $550;
            };
            return _scr$6;
        })();
        var $549 = _scr$5;
        return $549;
    };
    const Mons$draw$image = x0 => x1 => x2 => Mons$draw$image$(x0, x1, x2);
    const Mons$f_exe = Image3D$parse$("7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff817f28ffffff");
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function List$imap$(_f$3, _xs$4) {
        var self = _xs$4;
        switch (self._) {
            case 'List.cons':
                var $554 = self.head;
                var $555 = self.tail;
                var $556 = List$cons$(_f$3(0n)($554), List$imap$((_n$7 => {
                    var $557 = _f$3(Nat$succ$(_n$7));
                    return $557;
                }), $555));
                var $553 = $556;
                break;
            case 'List.nil':
                var $558 = List$nil;
                var $553 = $558;
                break;
        };
        return $553;
    };
    const List$imap = x0 => x1 => List$imap$(x0, x1);

    function List$indices$u32$(_xs$2) {
        var $559 = List$imap$((_i$3 => _x$4 => {
            var $560 = Pair$new$((Number(_i$3)), _x$4);
            return $560;
        }), _xs$2);
        return $559;
    };
    const List$indices$u32 = x0 => List$indices$u32$(x0);

    function String$to_list$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $562 = List$nil;
            var $561 = $562;
        } else {
            var $563 = self.charCodeAt(0);
            var $564 = self.slice(1);
            var $565 = List$cons$($563, String$to_list$($564));
            var $561 = $565;
        };
        return $561;
    };
    const String$to_list = x0 => String$to_list$(x0);
    const U16$to_bits = a0 => (u16_to_bits(a0));

    function Mons$font$get_img$(_char$1, _map$2) {
        var self = Map$get$((u16_to_bits(_char$1)), _map$2);
        switch (self._) {
            case 'Maybe.some':
                var $567 = self.value;
                var $568 = Maybe$some$($567);
                var $566 = $568;
                break;
            case 'Maybe.none':
                var $569 = Maybe$none;
                var $566 = $569;
                break;
        };
        return $566;
    };
    const Mons$font$get_img = x0 => x1 => Mons$font$get_img$(x0, x1);

    function Mons$draw$char$(_chr$1, _font_map$2, _chr_pos$3, _scr$4) {
        var self = Mons$font$get_img$(_chr$1, _font_map$2);
        switch (self._) {
            case 'Maybe.some':
                var $571 = self.value;
                var _img$6 = $571;
                var _img_len$7 = Image3D$get_length$(_img$6);
                var _scr$8 = (() => {
                    var $573 = _scr$4;
                    var $574 = 0;
                    var $575 = _img_len$7;
                    let _scr$9 = $573;
                    for (let _i$8 = $574; _i$8 < $575; ++_i$8) {
                        var _vox_pos$10 = ((_img$6.buffer[_i$8 * 2]));
                        var _pos$11 = Pos32$sub$(Pos32$add$(_chr_pos$3, _vox_pos$10), Mons$vox_mid);
                        var _col$12 = ((_img$6.buffer[_i$8 * 2 + 1]));
                        var $573 = ((_scr$9.buffer[_scr$9.length * 2] = _pos$11, _scr$9.buffer[_scr$9.length * 2 + 1] = _col$12, _scr$9.length++, _scr$9));
                        _scr$9 = $573;
                    };
                    return _scr$9;
                })();
                var $572 = _scr$8;
                var $570 = $572;
                break;
            case 'Maybe.none':
                var $576 = _scr$4;
                var $570 = $576;
                break;
        };
        return $570;
    };
    const Mons$draw$char = x0 => x1 => x2 => x3 => Mons$draw$char$(x0, x1, x2, x3);

    function Mons$draw$text$(_txt$1, _font_map$2, _chr_pos$3, _scr$4) {
        var _scr$5 = (() => {
            var $579 = _scr$4;
            var $580 = List$indices$u32$(String$to_list$(_txt$1));
            let _scr$6 = $579;
            let _pair$5;
            while ($580._ === 'List.cons') {
                _pair$5 = $580.head;
                var self = _pair$5;
                switch (self._) {
                    case 'Pair.new':
                        var $581 = self.fst;
                        var $582 = self.snd;
                        var _add_pos$9 = ((0 | (($581 * 6) >>> 0) | (0 << 12) | (0 << 24)));
                        var $583 = Mons$draw$char$($582, _font_map$2, Pos32$add$(_chr_pos$3, _add_pos$9), _scr$6);
                        var $579 = $583;
                        break;
                };
                _scr$6 = $579;
                $580 = $580.tail;
            }
            return _scr$6;
        })();
        var $577 = _scr$5;
        return $577;
    };
    const Mons$draw$text = x0 => x1 => x2 => x3 => Mons$draw$text$(x0, x1, x2, x3);

    function Mons$draw$list$go$(_texts$1, _horizontal$2, _spacing$3, _font_map$4, _pos$5, _scr$6, _idx$7) {
        var Mons$draw$list$go$ = (_texts$1, _horizontal$2, _spacing$3, _font_map$4, _pos$5, _scr$6, _idx$7) => ({
            ctr: 'TCO',
            arg: [_texts$1, _horizontal$2, _spacing$3, _font_map$4, _pos$5, _scr$6, _idx$7]
        });
        var Mons$draw$list$go = _texts$1 => _horizontal$2 => _spacing$3 => _font_map$4 => _pos$5 => _scr$6 => _idx$7 => Mons$draw$list$go$(_texts$1, _horizontal$2, _spacing$3, _font_map$4, _pos$5, _scr$6, _idx$7);
        var arg = [_texts$1, _horizontal$2, _spacing$3, _font_map$4, _pos$5, _scr$6, _idx$7];
        while (true) {
            let [_texts$1, _horizontal$2, _spacing$3, _font_map$4, _pos$5, _scr$6, _idx$7] = arg;
            var R = (() => {
                var _x$8 = ((_pos$5 & 0xFFF));
                var _y$9 = (((_pos$5 >>> 12) & 0xFFF));
                var self = _horizontal$2;
                if (self) {
                    var $585 = ((0 | ((((_spacing$3 + _idx$7) >>> 0) + _x$8) >>> 0) | (_y$9 << 12) | (0 << 24)));
                    var _pos$10 = $585;
                } else {
                    var $586 = ((0 | _x$8 | (((((_spacing$3 + _idx$7) >>> 0) + _y$9) >>> 0) << 12) | (0 << 24)));
                    var _pos$10 = $586;
                };
                var self = _texts$1;
                switch (self._) {
                    case 'List.cons':
                        var $587 = self.head;
                        var $588 = self.tail;
                        var _scr$13 = Mons$draw$text$($587, _font_map$4, _pos$10, _scr$6);
                        var $589 = Mons$draw$list$go$($588, _horizontal$2, _spacing$3, _font_map$4, _pos$10, _scr$13, ((_idx$7 + 1) >>> 0));
                        var $584 = $589;
                        break;
                    case 'List.nil':
                        var $590 = _scr$6;
                        var $584 = $590;
                        break;
                };
                return $584;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Mons$draw$list$go = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Mons$draw$list$go$(x0, x1, x2, x3, x4, x5, x6);

    function Mons$draw$list$(_texts$1, _horizontal$2, _spacing$3, _font_map$4, _start_pos$5, _scr$6) {
        var _qtd$7 = (Number((list_length(_texts$1))));
        var $591 = Mons$draw$list$go$(_texts$1, _horizontal$2, _spacing$3, _font_map$4, _start_pos$5, _scr$6, 0);
        return $591;
    };
    const Mons$draw$list = x0 => x1 => x2 => x3 => x4 => x5 => Mons$draw$list$(x0, x1, x2, x3, x4, x5);

    function Mons$font$set_img$(_char$1, _img$2, _map$3) {
        var $592 = Map$set$((u16_to_bits(_char$1)), _img$2, _map$3);
        return $592;
    };
    const Mons$font$set_img = x0 => x1 => x2 => Mons$font$set_img$(x0, x1, x2);

    function U16$new$(_value$1) {
        var $593 = word_to_u16(_value$1);
        return $593;
    };
    const U16$new = x0 => U16$new$(x0);

    function U16$inc$(_a$1) {
        var self = _a$1;
        switch ('u16') {
            case 'u16':
                var $595 = u16_to_word(self);
                var $596 = U16$new$(Word$inc$($595));
                var $594 = $596;
                break;
        };
        return $594;
    };
    const U16$inc = x0 => U16$inc$(x0);
    const U16$zero = U16$new$(Word$zero$(16n));
    const Nat$to_u16 = a0 => (Number(a0));
    const Mons$Char_black$100 = Image3D$parse$("817c28ffffff817d28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$101 = Image3D$parse$("7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff7e8028ffffff7f8028ffffff808028ffffff818028ffffff7d8128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$102 = Image3D$parse$("7f7c28ffffff807c28ffffff817c28ffffff7e7d28ffffff7e7e28ffffff7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff817f28ffffff7e8028ffffff7e8128ffffff7e8228ffffff7e8328ffffff");
    const Mons$Char_black$103 = Image3D$parse$("7e7e28ffffff7f7e28ffffff807e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff818428ffffff7e8528ffffff7f8528ffffff808528ffffff");
    const Mons$Char_black$104 = Image3D$parse$("7d7c28ffffff7d7d28ffffff7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$105 = Image3D$parse$("7f7d28ffffff7e7f28ffffff7f7f28ffffff7f8028ffffff7f8128ffffff7f8228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$106 = Image3D$parse$("817d28ffffff7f7f28ffffff807f28ffffff817f28ffffff818028ffffff818128ffffff818228ffffff818328ffffff818428ffffff7e8528ffffff7f8528ffffff808528ffffff");
    const Mons$Char_black$107 = Image3D$parse$("7d7c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff807f28ffffff7d8028ffffff7e8028ffffff7f8028ffffff7d8128ffffff808128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$108 = Image3D$parse$("7e7c28ffffff7f7c28ffffff7f7d28ffffff7f7e28ffffff7f7f28ffffff7f8028ffffff7f8128ffffff7f8228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$109 = Image3D$parse$("7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff7f7f28ffffff817f28ffffff7d8028ffffff7f8028ffffff818028ffffff7d8128ffffff7f8128ffffff818128ffffff7d8228ffffff7f8228ffffff818228ffffff7d8328ffffff7f8328ffffff818328ffffff");
    const Mons$Char_black$110 = Image3D$parse$("7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$111 = Image3D$parse$("7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$112 = Image3D$parse$("7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff7d8428ffffff7d8528ffffff");
    const Mons$Char_black$113 = Image3D$parse$("7e7e28ffffff7f7e28ffffff807e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff818428ffffff818528ffffff");
    const Mons$Char_black$114 = Image3D$parse$("7d7e28ffffff807e28ffffff817e28ffffff7d7f28ffffff7f7f28ffffff7d8028ffffff7e8028ffffff7d8128ffffff7d8228ffffff7d8328ffffff");
    const Mons$Char_black$115 = Image3D$parse$("7e7e28ffffff7f7e28ffffff807e28ffffff817e28ffffff7d7f28ffffff7e8028ffffff7f8028ffffff808028ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$116 = Image3D$parse$("7e7c28ffffff7e7d28ffffff7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff7e7f28ffffff7e8028ffffff7e8128ffffff7e8228ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$117 = Image3D$parse$("7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$118 = Image3D$parse$("7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7e8228ffffff808228ffffff7f8328ffffff");
    const Mons$Char_black$119 = Image3D$parse$("7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff7f8128ffffff818128ffffff7d8228ffffff7f8228ffffff818228ffffff7e8328ffffff808328ffffff");
    const Mons$Char_black$120 = Image3D$parse$("7d7e28ffffff817e28ffffff7e7f28ffffff807f28ffffff7f8028ffffff7f8128ffffff7e8228ffffff808228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$121 = Image3D$parse$("7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff808428ffffff7d8528ffffff7e8528ffffff7f8528ffffff");
    const Mons$Char_black$122 = Image3D$parse$("7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff817e28ffffff817f28ffffff7f8028ffffff808028ffffff7e8128ffffff7d8228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$123 = Image3D$parse$("807c28ffffff7f7d28ffffff7f7e28ffffff7f7f28ffffff7e8028ffffff7f8128ffffff7f8228ffffff808328ffffff");
    const Mons$Char_black$124 = Image3D$parse$("7f7c28ffffff7f7d28ffffff7f7e28ffffff7f7f28ffffff7f8028ffffff7f8128ffffff7f8228ffffff7f8328ffffff");
    const Mons$Char_black$125 = Image3D$parse$("7e7c28ffffff7f7d28ffffff7f7e28ffffff7f7f28ffffff808028ffffff7f8128ffffff7f8228ffffff7e8328ffffff");
    const Mons$Char_black$126 = Image3D$parse$("7e7b28ffffff817b28ffffff7d7c28ffffff7f7c28ffffff817c28ffffff7d7d28ffffff807d28ffffff");
    const Mons$Char_black$32 = Image3D$parse$("");
    const Mons$Char_black$33 = Image3D$parse$("7f7c28ffffff7f7d28ffffff7f7e28ffffff7f7f28ffffff7f8028ffffff7f8128ffffff7f8328ffffff");
    const Mons$Char_black$34 = Image3D$parse$("7e7c28ffffff807c28ffffff7e7d28ffffff807d28ffffff");
    const Mons$Char_black$35 = Image3D$parse$("7e7c28ffffff807c28ffffff7e7d28ffffff807d28ffffff7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff817e28ffffff7e7f28ffffff807f28ffffff7e8028ffffff808028ffffff7d8128ffffff7e8128ffffff7f8128ffffff808128ffffff818128ffffff7e8228ffffff808228ffffff7e8328ffffff808328ffffff");
    const Mons$Char_black$36 = Image3D$parse$("7f7b28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff7e7f28ffffff7f8028ffffff808028ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff7f8428ffffff");
    const Mons$Char_black$37 = Image3D$parse$("7e7b28ffffff7d7c28ffffff7f7c28ffffff7e7d28ffffff817d28ffffff807e28ffffff7f7f28ffffff7e8028ffffff7d8128ffffff808128ffffff7f8228ffffff818228ffffff808328ffffff");
    const Mons$Char_black$38 = Image3D$parse$("7e7c28ffffff7f7c28ffffff7d7d28ffffff807d28ffffff7d7e28ffffff807e28ffffff7e7f28ffffff7f7f28ffffff7d8028ffffff7d8128ffffff7f8128ffffff808128ffffff818128ffffff7d8228ffffff808228ffffff7e8328ffffff7f8328ffffff818328ffffff");
    const Mons$Char_black$39 = Image3D$parse$("7f7c28ffffff7f7d28ffffff");
    const Mons$Char_black$40 = Image3D$parse$("807c28ffffff7f7d28ffffff7e7e28ffffff7e7f28ffffff7e8028ffffff7e8128ffffff7f8228ffffff808328ffffff");
    const Mons$Char_black$41 = Image3D$parse$("7e7c28ffffff7f7d28ffffff807e28ffffff807f28ffffff808028ffffff808128ffffff7f8228ffffff7e8328ffffff");
    const Mons$Char_black$42 = Image3D$parse$("7e7d28ffffff807d28ffffff7f7e28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff7f8028ffffff7e8128ffffff808128ffffff");
    const Mons$Char_black$43 = Image3D$parse$("7f7d28ffffff7f7e28ffffff7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff817f28ffffff7f8028ffffff7f8128ffffff");
    const Mons$Char_black$44 = Image3D$parse$("7f8228ffffff808228ffffff7f8328ffffff808328ffffff808428ffffff7f8528ffffff");
    const Mons$Char_black$45 = Image3D$parse$("7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff817f28ffffff");
    const Mons$Char_black$46 = Image3D$parse$("808328ffffff818328ffffff");
    const Mons$Char_black$47 = Image3D$parse$("817c28ffffff807d28ffffff807e28ffffff7f7f28ffffff7f8028ffffff7e8128ffffff7e8228ffffff7d8328ffffff");
    const Mons$Char_black$48 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff807e28ffffff817e28ffffff7d7f28ffffff7f7f28ffffff817f28ffffff7d8028ffffff7f8028ffffff818028ffffff7d8128ffffff7e8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$49 = Image3D$parse$("807c28ffffff7f7d28ffffff807d28ffffff7e7e28ffffff807e28ffffff7d7f28ffffff807f28ffffff808028ffffff808128ffffff808228ffffff808328ffffff");
    const Mons$Char_black$50 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff807f28ffffff7f8028ffffff7e8128ffffff7d8228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$51 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff817e28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff818028ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$52 = Image3D$parse$("7e7c28ffffff7e7d28ffffff7e7e28ffffff807e28ffffff7e7f28ffffff807f28ffffff7d8028ffffff808028ffffff7d8128ffffff7e8128ffffff7f8128ffffff808128ffffff818128ffffff808228ffffff808328ffffff");
    const Mons$Char_black$53 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff817c28ffffff7d7d28ffffff7d7e28ffffff7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff818028ffffff818128ffffff818228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$54 = Image3D$parse$("807c28ffffff7f7d28ffffff7e7e28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$55 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff817c28ffffff817d28ffffff807e28ffffff7f7f28ffffff7e8028ffffff7e8128ffffff7e8228ffffff7e8328ffffff");
    const Mons$Char_black$56 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$57 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7e8028ffffff7f8028ffffff808028ffffff808128ffffff7f8228ffffff7e8328ffffff");
    const Mons$Char_black$58 = Image3D$parse$("7f7f28ffffff807f28ffffff7f8228ffffff808228ffffff");
    const Mons$Char_black$59 = Image3D$parse$("7f7f28ffffff807f28ffffff7f8228ffffff808228ffffff7f8328ffffff808328ffffff808428ffffff7f8528ffffff");
    const Mons$Char_black$60 = Image3D$parse$("807c28ffffff7f7d28ffffff7e7e28ffffff7d7f28ffffff7d8028ffffff7e8128ffffff7f8228ffffff808328ffffff");
    const Mons$Char_black$61 = Image3D$parse$("7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff817f28ffffff7d8128ffffff7e8128ffffff7f8128ffffff808128ffffff818128ffffff");
    const Mons$Char_black$62 = Image3D$parse$("7e7c28ffffff7f7d28ffffff807e28ffffff817f28ffffff818028ffffff808128ffffff7f8228ffffff7e8328ffffff");
    const Mons$Char_black$63 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff807f28ffffff7f8028ffffff7f8128ffffff7f8328ffffff");
    const Mons$Char_black$64 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff807e28ffffff817e28ffffff7d7f28ffffff7f7f28ffffff817f28ffffff7d8028ffffff7f8028ffffff818028ffffff7d8128ffffff808128ffffff818128ffffff7d8228ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$65 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff7e8128ffffff7f8128ffffff808128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$66 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$67 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff7d7f28ffffff7d8028ffffff7d8128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$68 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$69 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff817c28ffffff7d7d28ffffff7d7e28ffffff7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff817f28ffffff7d8028ffffff7d8128ffffff7d8228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$70 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff817c28ffffff7d7d28ffffff7d7e28ffffff7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff7d8028ffffff7d8128ffffff7d8228ffffff7d8328ffffff");
    const Mons$Char_black$71 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff7d7f28ffffff7d8028ffffff7d8128ffffff808128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$72 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff7e7f28ffffff7f7f28ffffff807f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$73 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7f7d28ffffff7f7e28ffffff7f7f28ffffff7f8028ffffff7f8128ffffff7f8228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$74 = Image3D$parse$("817c28ffffff817d28ffffff817e28ffffff817f28ffffff818028ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$75 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff807d28ffffff7d7e28ffffff7f7e28ffffff7d7f28ffffff7e7f28ffffff7d8028ffffff7f8028ffffff7d8128ffffff808128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$76 = Image3D$parse$("7d7c28ffffff7d7d28ffffff7d7e28ffffff7d7f28ffffff7d8028ffffff7d8128ffffff7d8228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$77 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff7e7d28ffffff807d28ffffff817d28ffffff7d7e28ffffff7f7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$78 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff7e7d28ffffff817d28ffffff7d7e28ffffff7f7e28ffffff817e28ffffff7d7f28ffffff807f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$79 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$80 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff7e8028ffffff7f8028ffffff808028ffffff7d8128ffffff7d8228ffffff7d8328ffffff");
    const Mons$Char_black$81 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff808428ffffff818428ffffff");
    const Mons$Char_black$82 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff7e8028ffffff7f8028ffffff808028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$83 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff7e7f28ffffff7f7f28ffffff808028ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$84 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff817c28ffffff7f7d28ffffff7f7e28ffffff7f7f28ffffff7f8028ffffff7f8128ffffff7f8228ffffff7f8328ffffff");
    const Mons$Char_black$85 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$86 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7e8228ffffff808228ffffff7f8328ffffff");
    const Mons$Char_black$87 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff7f8128ffffff818128ffffff7d8228ffffff7e8228ffffff808228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$88 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff817d28ffffff7e7e28ffffff807e28ffffff7f7f28ffffff7f8028ffffff7e8128ffffff808128ffffff7d8228ffffff818228ffffff7d8328ffffff818328ffffff");
    const Mons$Char_black$89 = Image3D$parse$("7d7c28ffffff817c28ffffff7d7d28ffffff817d28ffffff7d7e28ffffff817e28ffffff7e7f28ffffff807f28ffffff7f8028ffffff7f8128ffffff7f8228ffffff7f8328ffffff");
    const Mons$Char_black$90 = Image3D$parse$("7d7c28ffffff7e7c28ffffff7f7c28ffffff807c28ffffff817c28ffffff817d28ffffff807e28ffffff7f7f28ffffff7e8028ffffff7e8128ffffff7d8228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$91 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff7e7d28ffffff7e7e28ffffff7e7f28ffffff7e8028ffffff7e8128ffffff7e8228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$92 = Image3D$parse$("7d7c28ffffff7e7d28ffffff7e7e28ffffff7f7f28ffffff7f8028ffffff808128ffffff808228ffffff818328ffffff");
    const Mons$Char_black$93 = Image3D$parse$("7e7c28ffffff7f7c28ffffff807c28ffffff807d28ffffff807e28ffffff807f28ffffff808028ffffff808128ffffff808228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$94 = Image3D$parse$("7f7b28ffffff7e7c28ffffff807c28ffffff7d7d28ffffff817d28ffffff");
    const Mons$Char_black$95 = Image3D$parse$("7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$96 = Image3D$parse$("7e7b28ffffff7f7c28ffffff807d28ffffff");
    const Mons$Char_black$97 = Image3D$parse$("7e7e28ffffff7f7e28ffffff807e28ffffff817f28ffffff7e8028ffffff7f8028ffffff808028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff818328ffffff");
    const Mons$Char_black$98 = Image3D$parse$("7d7c28ffffff7d7d28ffffff7d7e28ffffff7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff818028ffffff7d8128ffffff818128ffffff7d8228ffffff818228ffffff7d8328ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$99 = Image3D$parse$("7e7e28ffffff7f7e28ffffff807e28ffffff7d7f28ffffff817f28ffffff7d8028ffffff7d8128ffffff7d8228ffffff818228ffffff7e8328ffffff7f8328ffffff808328ffffff");
    const Mons$Char_black$normal = Image3D$parse$("7e7e28544b487f7e28544b48807e28544b487d7f28544b487e7f28e7dcc17f7f28cab89d807f28bba38a817f28544b487d8028544b487e8028cab89d7f8028bba38a808028bba38a818028544b487d8128544b487e8128bba38a7f8128bba38a808128a5876e818128544b487e8228544b487f8228544b48808228544b48");
    const Mons$Char_black$earth = Image3D$parse$("7d7e285f35387e7e285f35387f7e285f3538807e285f3538817e285f35387d7f285f35387e7f289f5b447f7f289f5b44807f289f5b44817f285f35387d80284b2a357e8028884e3f7f8028884e3f808028884e3f8180284b2a357e81284b2a357f81286f403b8081284b2a357e82284b2a357f82284b2a358082284b2a35");
    const Mons$Char_black$fire = Image3D$parse$("7e7d28a432347f7d28a432347e7e28a432347f7e28fbe896807e28a432347d7f2898202e7e7f28e7cb557f7f28e7cb55807f28e7cb55817f2898202e7d802898202e7e8028efa93f7f8028efa93f808028efa93f81802898202e7d812877262f7e8128d3783c7f8128d3783c808128d3783c81812877262f7e822877262f7f822877262f80822877262f");
    const Mons$Char_black$water = Image3D$parse$("7e7d282f37707f7d282f37707e7e282f37707f7e28f0e8cc807e282f37707d7f282f37707e7f2863a9a47f7f2882c8ac807f28f0e8cc817f282f37707d80282729607e802863a9a47f8028799cd380802882c8ac8180282729607d81282729607e8128428a9b7f812863a9a480812863a9a48181282729607e82283421637f8228342163808228342163");
    const Mons$Char_black$grass = Image3D$parse$("807d28375839817d28477e3d7f7e28375839807e2885ca77817e283758397e7f283758397f7f2885ca77807f2864af69817f283758397d80282a56517e802885ca777f8028287f4e80802864af698180283758397d81282a56517e8128287f4e7f812864af6980812885ca778181283758397e82282a56517f82282a5651808228375839");
    const Mons$Char_black$electric = Image3D$parse$("7f7d28d3783c807d28d3783c7e7e28c766437f7e28e7cb55807e28d3783c7d7f28b64c3b7e7f28dab04d7f7f28c766437e8028c766437f8028dab04d808028b64c3b7d8128c766437e8128e7cb557f8128c766437d8228d3783c7e8228c76643");
    const Mons$Char_black$psychic = Image3D$parse$("7e7e286420737f7e28642073807e286420737d7f286420737e7f28c757a67f7f28ac4999807f28f0e8cc817f286420737d80284a2b717e8028fa83a97f8028342163808028ac49998180284a2b717d81283421637e8128fa83a97f8128fa83a9808128c757a68181283421637e82283421637f8228342163808228342163");
    const Mons$Char_black$ice = Image3D$parse$("7e7e2882c8ac7f7e284662a1807e2882c8ac7d7f2882c8ac7e7f2863a9a47f7f28394c87807f2863a9a4817f2882c8ac7d80284662a17e8028394c877f802863a9a4808028394c878180284662a17d812882c8ac7e812863a9a47f8128394c8780812863a9a481812882c8ac7e822882c8ac7f82284662a180822882c8ac");
    const Mons$Char_black$light = Image3D$parse$("7e7e28d296437f7e28dab04d807e28d296437d7f28d296437e7f28fbe8967f7f28e7cb55807f28fbe896817f28d296437d8028dab04d7e8028e7cb557f8028fbe896808028e7cb55818028dab04d7d8128d296437e8128fbe8967f8128e7cb55808128fbe896818128d296437e8228d296437f8228dab04d808228d29643");
    const Mons$Char_black$darkness = Image3D$parse$("7e7e284a2b717f7e282c333d807e284a2b717d7f284a2b717e7f286a3a867f7f28353b48807f286a3a86817f284a2b717d80282c333d7e8028353b487f80282c333d808028353b488180282c333d7d81284a2b717e81286a3a867f8128353b488081286a3a868181284a2b717e82284a2b717f82282c333d8082284a2b71");
    const Mons$Char_black$s_72 = Image3D$parse$("7d7d28212128807d282121287d7e28212128807e282121287d7f282121287e7f282121287f7f28212128807f282121287d80282121288080282121287d8128212128808128212128");
    const Mons$Char_black$s_80 = Image3D$parse$("7d7d282121287e7d282121287f7d28212128807d282121287d7e28212128807e282121287d7f282121287e7f282121287f7f282121287d80282121287d8128212128");
    const Mons$Char_black$burn = Image3D$parse$("7d7d1e4b2a357e7d1e4b2a357f7d1e4b2a357d7e1e4b2a357e7e1efa642f7f7e1efa642f807e1e4b2a357e7f1e4b2a357f7f1eefa93f807f1efa642f817f1e4b2a357d801e4b2a357e801eefa93f7f801efbe89680801efbe89681801e4b2a357d811e4b2a357e811efa642f7f811eefa93f80811efbe89681811e4b2a357d821e4b2a357e821efa642f7f821efa642f80821eefa93f81821e4b2a357e831e4b2a357f831e4b2a3580831e4b2a35");
    const Mons$Char_black$hit = Image3D$parse$("7f7d1e3758397e7e1e3758397f7e1ec7c85c807e1e3758397e7f1e3758397f7f1ec7c85c807f1e3758397d801e3758397e801e6b91477f801e6b914780801ec7c85c81801e3758397d811e3758397e811e477e3d7f811e477e3d80811ec7c85c81811e3758397d821e3758397e821e477e3d7f821e477e3d80821e6b914781821e3758397e831e3758397f831e37583980831e375839");
    const Mons$Char_black$invulnerable = Image3D$parse$("7d7d1e4b2a357e7d1e4b2a35817d1e4b2a357d7e1e4b2a357e7e1edab04d7f7e1e4b2a35807e1e4b2a35817e1ef0e8cc7e7f1e4b2a357f7f1ef0e8cc807f1ee7cb55817f1e4b2a357e801e4b2a357f801ee7cb5580801edab04d81801e4b2a357d811e4b2a357e811ee7cb557f811edab04d80811ed3783c81811e4b2a357d821edab04d7e821e4b2a357f821e4b2a3580821e4b2a3581821edab04d7d831e4b2a3581831e4b2a35");
    const Mons$Char_black$minimize = Image3D$parse$("7d7d1e2c333d7e7d1e2c333d7f7d1e2c333d807d1e2c333d817d1e2c333d7d7e1e2c333d7e7e1e656c7f7f7e1eabaeb2807e1eabaeb2817e1e2c333d7d7f1e2c333d7e7f1e656c7f7f7f1e656c7f807f1e656c7f817f1e2c333d7d801e2c333d7e801e565d6e7f801e565d6e80801e656c7f81801e2c333d7d811e2c333d7e811e565d6e7f811e565d6e80811e656c7f81811e2c333d7e821e2c333d7f821e565d6e80821e2c333d7f831e2c333d");
    const Mons$Char_black$poison = Image3D$parse$("7f7d1e5f19347e7e1e5f19347f7e1edf3e46807e1e5f19347e7f1e5f19347f7f1edf3e46807f1e5f19347d801e5f19347e801ea2242c7f801ea2242c80801edf3e4681801e5f19347d811e5f19347e811e8c0b2c7f811e8c0b2c80811edf3e4681811e5f19347d821e5f19347e821e8c0b2c7f821e8c0b2c80821ea2242c81821e5f19347e831e5f19347f831e5f193480831e5f1934");
    const Mons$Char_black$protect = Image3D$parse$("7d7d1e4b2a357e7d1e4b2a357f7d1e4b2a35807d1e4b2a35817d1e4b2a357d7e1e4b2a357e7e1ecc833c7f7e1edab04d807e1edab04d817e1e4b2a357d7f1e4b2a357e7f1ecc833c7f7f1ecc833c807f1ecc833c817f1e4b2a357d801e4b2a357e801eb96b337f801eb96b3380801ecc833c81801e4b2a357d811e4b2a357e811eb96b337f811eb96b3380811ecc833c81811e4b2a357e821e4b2a357f821eb96b3380821e4b2a357f831e4b2a35");
    const Mons$Char_black$sleep = Image3D$parse$("7d7d1e2729607e7d1e2729607f7d1e272960807d1e272960817d1e2729607d7e1e2729607e7e1e799cd37f7e1e799cd3807e1e799cd3817e1e2729607e7f1e2729607f7f1e272960807f1e799cd3817f1e2729607e801e2729607f801e5176b880801e2729607d811e2729607e811e4662a17f811e27296080811e2729607d821e2729607e821e4662a17f821e4662a180821e4662a181821e2729607d831e2729607e831e2729607f831e27296080831e27296081831e272960");
    const Mons$Char_black$font = (() => {
        var _map$1 = Map$new;
        var _map$2 = Mons$font$set_img$(100, Mons$Char_black$100, _map$1);
        var _map$3 = Mons$font$set_img$(101, Mons$Char_black$101, _map$2);
        var _map$4 = Mons$font$set_img$(102, Mons$Char_black$102, _map$3);
        var _map$5 = Mons$font$set_img$(103, Mons$Char_black$103, _map$4);
        var _map$6 = Mons$font$set_img$(104, Mons$Char_black$104, _map$5);
        var _map$7 = Mons$font$set_img$(105, Mons$Char_black$105, _map$6);
        var _map$8 = Mons$font$set_img$(106, Mons$Char_black$106, _map$7);
        var _map$9 = Mons$font$set_img$(107, Mons$Char_black$107, _map$8);
        var _map$10 = Mons$font$set_img$(108, Mons$Char_black$108, _map$9);
        var _map$11 = Mons$font$set_img$(109, Mons$Char_black$109, _map$10);
        var _map$12 = Mons$font$set_img$(110, Mons$Char_black$110, _map$11);
        var _map$13 = Mons$font$set_img$(111, Mons$Char_black$111, _map$12);
        var _map$14 = Mons$font$set_img$(112, Mons$Char_black$112, _map$13);
        var _map$15 = Mons$font$set_img$(113, Mons$Char_black$113, _map$14);
        var _map$16 = Mons$font$set_img$(114, Mons$Char_black$114, _map$15);
        var _map$17 = Mons$font$set_img$(115, Mons$Char_black$115, _map$16);
        var _map$18 = Mons$font$set_img$(116, Mons$Char_black$116, _map$17);
        var _map$19 = Mons$font$set_img$(117, Mons$Char_black$117, _map$18);
        var _map$20 = Mons$font$set_img$(118, Mons$Char_black$118, _map$19);
        var _map$21 = Mons$font$set_img$(119, Mons$Char_black$119, _map$20);
        var _map$22 = Mons$font$set_img$(120, Mons$Char_black$120, _map$21);
        var _map$23 = Mons$font$set_img$(121, Mons$Char_black$121, _map$22);
        var _map$24 = Mons$font$set_img$(122, Mons$Char_black$122, _map$23);
        var _map$25 = Mons$font$set_img$(123, Mons$Char_black$123, _map$24);
        var _map$26 = Mons$font$set_img$(124, Mons$Char_black$124, _map$25);
        var _map$27 = Mons$font$set_img$(125, Mons$Char_black$125, _map$26);
        var _map$28 = Mons$font$set_img$(126, Mons$Char_black$126, _map$27);
        var _map$29 = Mons$font$set_img$(32, Mons$Char_black$32, _map$28);
        var _map$30 = Mons$font$set_img$(33, Mons$Char_black$33, _map$29);
        var _map$31 = Mons$font$set_img$(34, Mons$Char_black$34, _map$30);
        var _map$32 = Mons$font$set_img$(35, Mons$Char_black$35, _map$31);
        var _map$33 = Mons$font$set_img$(36, Mons$Char_black$36, _map$32);
        var _map$34 = Mons$font$set_img$(37, Mons$Char_black$37, _map$33);
        var _map$35 = Mons$font$set_img$(38, Mons$Char_black$38, _map$34);
        var _map$36 = Mons$font$set_img$(39, Mons$Char_black$39, _map$35);
        var _map$37 = Mons$font$set_img$(40, Mons$Char_black$40, _map$36);
        var _map$38 = Mons$font$set_img$(41, Mons$Char_black$41, _map$37);
        var _map$39 = Mons$font$set_img$(42, Mons$Char_black$42, _map$38);
        var _map$40 = Mons$font$set_img$(43, Mons$Char_black$43, _map$39);
        var _map$41 = Mons$font$set_img$(44, Mons$Char_black$44, _map$40);
        var _map$42 = Mons$font$set_img$(45, Mons$Char_black$45, _map$41);
        var _map$43 = Mons$font$set_img$(46, Mons$Char_black$46, _map$42);
        var _map$44 = Mons$font$set_img$(47, Mons$Char_black$47, _map$43);
        var _map$45 = Mons$font$set_img$(48, Mons$Char_black$48, _map$44);
        var _map$46 = Mons$font$set_img$(49, Mons$Char_black$49, _map$45);
        var _map$47 = Mons$font$set_img$(50, Mons$Char_black$50, _map$46);
        var _map$48 = Mons$font$set_img$(51, Mons$Char_black$51, _map$47);
        var _map$49 = Mons$font$set_img$(52, Mons$Char_black$52, _map$48);
        var _map$50 = Mons$font$set_img$(53, Mons$Char_black$53, _map$49);
        var _map$51 = Mons$font$set_img$(54, Mons$Char_black$54, _map$50);
        var _map$52 = Mons$font$set_img$(55, Mons$Char_black$55, _map$51);
        var _map$53 = Mons$font$set_img$(56, Mons$Char_black$56, _map$52);
        var _map$54 = Mons$font$set_img$(57, Mons$Char_black$57, _map$53);
        var _map$55 = Mons$font$set_img$(58, Mons$Char_black$58, _map$54);
        var _map$56 = Mons$font$set_img$(59, Mons$Char_black$59, _map$55);
        var _map$57 = Mons$font$set_img$(60, Mons$Char_black$60, _map$56);
        var _map$58 = Mons$font$set_img$(61, Mons$Char_black$61, _map$57);
        var _map$59 = Mons$font$set_img$(62, Mons$Char_black$62, _map$58);
        var _map$60 = Mons$font$set_img$(63, Mons$Char_black$63, _map$59);
        var _map$61 = Mons$font$set_img$(64, Mons$Char_black$64, _map$60);
        var _map$62 = Mons$font$set_img$(65, Mons$Char_black$65, _map$61);
        var _map$63 = Mons$font$set_img$(66, Mons$Char_black$66, _map$62);
        var _map$64 = Mons$font$set_img$(67, Mons$Char_black$67, _map$63);
        var _map$65 = Mons$font$set_img$(68, Mons$Char_black$68, _map$64);
        var _map$66 = Mons$font$set_img$(69, Mons$Char_black$69, _map$65);
        var _map$67 = Mons$font$set_img$(70, Mons$Char_black$70, _map$66);
        var _map$68 = Mons$font$set_img$(71, Mons$Char_black$71, _map$67);
        var _map$69 = Mons$font$set_img$(72, Mons$Char_black$72, _map$68);
        var _map$70 = Mons$font$set_img$(73, Mons$Char_black$73, _map$69);
        var _map$71 = Mons$font$set_img$(74, Mons$Char_black$74, _map$70);
        var _map$72 = Mons$font$set_img$(75, Mons$Char_black$75, _map$71);
        var _map$73 = Mons$font$set_img$(76, Mons$Char_black$76, _map$72);
        var _map$74 = Mons$font$set_img$(77, Mons$Char_black$77, _map$73);
        var _map$75 = Mons$font$set_img$(78, Mons$Char_black$78, _map$74);
        var _map$76 = Mons$font$set_img$(79, Mons$Char_black$79, _map$75);
        var _map$77 = Mons$font$set_img$(80, Mons$Char_black$80, _map$76);
        var _map$78 = Mons$font$set_img$(81, Mons$Char_black$81, _map$77);
        var _map$79 = Mons$font$set_img$(82, Mons$Char_black$82, _map$78);
        var _map$80 = Mons$font$set_img$(83, Mons$Char_black$83, _map$79);
        var _map$81 = Mons$font$set_img$(84, Mons$Char_black$84, _map$80);
        var _map$82 = Mons$font$set_img$(85, Mons$Char_black$85, _map$81);
        var _map$83 = Mons$font$set_img$(86, Mons$Char_black$86, _map$82);
        var _map$84 = Mons$font$set_img$(87, Mons$Char_black$87, _map$83);
        var _map$85 = Mons$font$set_img$(88, Mons$Char_black$88, _map$84);
        var _map$86 = Mons$font$set_img$(89, Mons$Char_black$89, _map$85);
        var _map$87 = Mons$font$set_img$(90, Mons$Char_black$90, _map$86);
        var _map$88 = Mons$font$set_img$(91, Mons$Char_black$91, _map$87);
        var _map$89 = Mons$font$set_img$(92, Mons$Char_black$92, _map$88);
        var _map$90 = Mons$font$set_img$(93, Mons$Char_black$93, _map$89);
        var _map$91 = Mons$font$set_img$(94, Mons$Char_black$94, _map$90);
        var _map$92 = Mons$font$set_img$(95, Mons$Char_black$95, _map$91);
        var _map$93 = Mons$font$set_img$(96, Mons$Char_black$96, _map$92);
        var _map$94 = Mons$font$set_img$(97, Mons$Char_black$97, _map$93);
        var _map$95 = Mons$font$set_img$(98, Mons$Char_black$98, _map$94);
        var _map$96 = Mons$font$set_img$(99, Mons$Char_black$99, _map$95);
        var _map$97 = Mons$font$set_img$(9312, Mons$Char_black$normal, _map$96);
        var _map$98 = Mons$font$set_img$(9313, Mons$Char_black$earth, _map$97);
        var _map$99 = Mons$font$set_img$(9314, Mons$Char_black$fire, _map$98);
        var _map$100 = Mons$font$set_img$(9315, Mons$Char_black$water, _map$99);
        var _map$101 = Mons$font$set_img$(9316, Mons$Char_black$grass, _map$100);
        var _map$102 = Mons$font$set_img$(9317, Mons$Char_black$electric, _map$101);
        var _map$103 = Mons$font$set_img$(9318, Mons$Char_black$psychic, _map$102);
        var _map$104 = Mons$font$set_img$(9319, Mons$Char_black$ice, _map$103);
        var _map$105 = Mons$font$set_img$(9320, Mons$Char_black$light, _map$104);
        var _map$106 = Mons$font$set_img$(9321, Mons$Char_black$darkness, _map$105);
        var _map$107 = Mons$font$set_img$(405, Mons$Char_black$s_72, _map$106);
        var _map$108 = Mons$font$set_img$(421, Mons$Char_black$s_80, _map$107);
        var _map$109 = Mons$font$set_img$(9398, Mons$Char_black$burn, _map$108);
        var _map$110 = Mons$font$set_img$(9399, Mons$Char_black$hit, _map$109);
        var _map$111 = Mons$font$set_img$(9400, Mons$Char_black$invulnerable, _map$110);
        var _map$112 = Mons$font$set_img$(9401, Mons$Char_black$minimize, _map$111);
        var _map$113 = Mons$font$set_img$(9402, Mons$Char_black$poison, _map$112);
        var _map$114 = Mons$font$set_img$(9403, Mons$Char_black$protect, _map$113);
        var _map$115 = Mons$font$set_img$(9404, Mons$Char_black$sleep, _map$114);
        var $597 = _map$115;
        return $597;
    })();

    function Mons$draw$list_selector$(_idx$1, _horizontal$2, _spacing$3, _font_map$4, _start_pos$5, _scr$6) {
        var _x$7 = ((_start_pos$5 & 0xFFF));
        var _y$8 = (((_start_pos$5 >>> 12) & 0xFFF));
        var _idx$9 = ((_idx$1 + 1) >>> 0);
        var self = _horizontal$2;
        if (self) {
            var $599 = ((0 | ((((_spacing$3 * _idx$9) >>> 0) + _x$7) >>> 0) | (_y$8 << 12) | (0 << 24)));
            var _pos$10 = $599;
        } else {
            var $600 = ((0 | _x$7 | (((((_spacing$3 * _idx$9) >>> 0) + _y$8) >>> 0) << 12) | (0 << 24)));
            var _pos$10 = $600;
        };
        var $598 = Mons$draw$text$("> ", _font_map$4, _pos$10, _scr$6);
        return $598;
    };
    const Mons$draw$list_selector = x0 => x1 => x2 => x3 => x4 => x5 => Mons$draw$list_selector$(x0, x1, x2, x3, x4, x5);
    const Mons$Char_white$100 = Image3D$parse$("817c1effffff817d1effffff7e7e1effffff7f7e1effffff807e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$101 = Image3D$parse$("7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff817f1effffff7d801effffff7e801effffff7f801effffff80801effffff81801effffff7d811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$102 = Image3D$parse$("7f7c1effffff807c1effffff817c1effffff7e7d1effffff7e7e1effffff7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff817f1effffff7e801effffff7e811effffff7e821effffff7e831effffff");
    const Mons$Char_white$103 = Image3D$parse$("7e7e1effffff7f7e1effffff807e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff81831effffff81841effffff7e851effffff7f851effffff80851effffff");
    const Mons$Char_white$104 = Image3D$parse$("7d7c1effffff7d7d1effffff7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$105 = Image3D$parse$("7f7d1effffff7e7f1effffff7f7f1effffff7f801effffff7f811effffff7f821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$106 = Image3D$parse$("817d1effffff7f7f1effffff807f1effffff817f1effffff81801effffff81811effffff81821effffff81831effffff81841effffff7e851effffff7f851effffff80851effffff");
    const Mons$Char_white$107 = Image3D$parse$("7d7c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff807f1effffff7d801effffff7e801effffff7f801effffff7d811effffff80811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$108 = Image3D$parse$("7e7c1effffff7f7c1effffff7f7d1effffff7f7e1effffff7f7f1effffff7f801effffff7f811effffff7f821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$109 = Image3D$parse$("7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff7f7f1effffff817f1effffff7d801effffff7f801effffff81801effffff7d811effffff7f811effffff81811effffff7d821effffff7f821effffff81821effffff7d831effffff7f831effffff81831effffff");
    const Mons$Char_white$110 = Image3D$parse$("7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$111 = Image3D$parse$("7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$112 = Image3D$parse$("7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff7e831effffff7f831effffff80831effffff7d841effffff7d851effffff");
    const Mons$Char_white$113 = Image3D$parse$("7e7e1effffff7f7e1effffff807e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff81831effffff81841effffff81851effffff");
    const Mons$Char_white$114 = Image3D$parse$("7d7e1effffff807e1effffff817e1effffff7d7f1effffff7f7f1effffff7d801effffff7e801effffff7d811effffff7d821effffff7d831effffff");
    const Mons$Char_white$115 = Image3D$parse$("7e7e1effffff7f7e1effffff807e1effffff817e1effffff7d7f1effffff7e801effffff7f801effffff80801effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$116 = Image3D$parse$("7e7c1effffff7e7d1effffff7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff7e7f1effffff7e801effffff7e811effffff7e821effffff7f831effffff80831effffff");
    const Mons$Char_white$117 = Image3D$parse$("7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$118 = Image3D$parse$("7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7e821effffff80821effffff7f831effffff");
    const Mons$Char_white$119 = Image3D$parse$("7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff7f811effffff81811effffff7d821effffff7f821effffff81821effffff7e831effffff80831effffff");
    const Mons$Char_white$120 = Image3D$parse$("7d7e1effffff817e1effffff7e7f1effffff807f1effffff7f801effffff7f811effffff7e821effffff80821effffff7d831effffff81831effffff");
    const Mons$Char_white$121 = Image3D$parse$("7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff80841effffff7d851effffff7e851effffff7f851effffff");
    const Mons$Char_white$122 = Image3D$parse$("7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff817e1effffff817f1effffff7f801effffff80801effffff7e811effffff7d821effffff7d831effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$123 = Image3D$parse$("807c1effffff7f7d1effffff7f7e1effffff7f7f1effffff7e801effffff7f811effffff7f821effffff80831effffff");
    const Mons$Char_white$124 = Image3D$parse$("7f7c1effffff7f7d1effffff7f7e1effffff7f7f1effffff7f801effffff7f811effffff7f821effffff7f831effffff");
    const Mons$Char_white$125 = Image3D$parse$("7e7c1effffff7f7d1effffff7f7e1effffff7f7f1effffff80801effffff7f811effffff7f821effffff7e831effffff");
    const Mons$Char_white$126 = Image3D$parse$("7e7b1effffff817b1effffff7d7c1effffff7f7c1effffff817c1effffff7d7d1effffff807d1effffff");
    const Mons$Char_white$32 = Image3D$parse$("");
    const Mons$Char_white$33 = Image3D$parse$("7f7c1effffff7f7d1effffff7f7e1effffff7f7f1effffff7f801effffff7f811effffff7f831effffff");
    const Mons$Char_white$34 = Image3D$parse$("7e7c1effffff807c1effffff7e7d1effffff807d1effffff");
    const Mons$Char_white$35 = Image3D$parse$("7e7c1effffff807c1effffff7e7d1effffff807d1effffff7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff817e1effffff7e7f1effffff807f1effffff7e801effffff80801effffff7d811effffff7e811effffff7f811effffff80811effffff81811effffff7e821effffff80821effffff7e831effffff80831effffff");
    const Mons$Char_white$36 = Image3D$parse$("7f7b1effffff7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff7e7f1effffff7f801effffff80801effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff7f841effffff");
    const Mons$Char_white$37 = Image3D$parse$("7e7b1effffff7d7c1effffff7f7c1effffff7e7d1effffff817d1effffff807e1effffff7f7f1effffff7e801effffff7d811effffff80811effffff7f821effffff81821effffff80831effffff");
    const Mons$Char_white$38 = Image3D$parse$("7e7c1effffff7f7c1effffff7d7d1effffff807d1effffff7d7e1effffff807e1effffff7e7f1effffff7f7f1effffff7d801effffff7d811effffff7f811effffff80811effffff81811effffff7d821effffff80821effffff7e831effffff7f831effffff81831effffff");
    const Mons$Char_white$39 = Image3D$parse$("7f7c1effffff7f7d1effffff");
    const Mons$Char_white$40 = Image3D$parse$("807c1effffff7f7d1effffff7e7e1effffff7e7f1effffff7e801effffff7e811effffff7f821effffff80831effffff");
    const Mons$Char_white$41 = Image3D$parse$("7e7c1effffff7f7d1effffff807e1effffff807f1effffff80801effffff80811effffff7f821effffff7e831effffff");
    const Mons$Char_white$42 = Image3D$parse$("7e7d1effffff807d1effffff7f7e1effffff7e7f1effffff7f7f1effffff807f1effffff7f801effffff7e811effffff80811effffff");
    const Mons$Char_white$43 = Image3D$parse$("7f7d1effffff7f7e1effffff7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff817f1effffff7f801effffff7f811effffff");
    const Mons$Char_white$44 = Image3D$parse$("7f821effffff80821effffff7f831effffff80831effffff80841effffff7f851effffff");
    const Mons$Char_white$45 = Image3D$parse$("7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff817f1effffff");
    const Mons$Char_white$46 = Image3D$parse$("80831effffff81831effffff");
    const Mons$Char_white$47 = Image3D$parse$("817c1effffff807d1effffff807e1effffff7f7f1effffff7f801effffff7e811effffff7e821effffff7d831effffff");
    const Mons$Char_white$48 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff807e1effffff817e1effffff7d7f1effffff7f7f1effffff817f1effffff7d801effffff7f801effffff81801effffff7d811effffff7e811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$49 = Image3D$parse$("807c1effffff7f7d1effffff807d1effffff7e7e1effffff807e1effffff7d7f1effffff807f1effffff80801effffff80811effffff80821effffff80831effffff");
    const Mons$Char_white$50 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff807f1effffff7f801effffff7e811effffff7d821effffff7d831effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$51 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff817e1effffff7e7f1effffff7f7f1effffff807f1effffff81801effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$52 = Image3D$parse$("7e7c1effffff7e7d1effffff7e7e1effffff807e1effffff7e7f1effffff807f1effffff7d801effffff80801effffff7d811effffff7e811effffff7f811effffff80811effffff81811effffff80821effffff80831effffff");
    const Mons$Char_white$53 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff817c1effffff7d7d1effffff7d7e1effffff7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff81801effffff81811effffff81821effffff7d831effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$54 = Image3D$parse$("807c1effffff7f7d1effffff7e7e1effffff7e7f1effffff7f7f1effffff807f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$55 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff817c1effffff817d1effffff807e1effffff7f7f1effffff7e801effffff7e811effffff7e821effffff7e831effffff");
    const Mons$Char_white$56 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7e7f1effffff7f7f1effffff807f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$57 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7e801effffff7f801effffff80801effffff80811effffff7f821effffff7e831effffff");
    const Mons$Char_white$58 = Image3D$parse$("7f7f1effffff807f1effffff7f821effffff80821effffff");
    const Mons$Char_white$59 = Image3D$parse$("7f7f1effffff807f1effffff7f821effffff80821effffff7f831effffff80831effffff80841effffff7f851effffff");
    const Mons$Char_white$60 = Image3D$parse$("807c1effffff7f7d1effffff7e7e1effffff7d7f1effffff7d801effffff7e811effffff7f821effffff80831effffff");
    const Mons$Char_white$61 = Image3D$parse$("7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff817f1effffff7d811effffff7e811effffff7f811effffff80811effffff81811effffff");
    const Mons$Char_white$62 = Image3D$parse$("7e7c1effffff7f7d1effffff807e1effffff817f1effffff81801effffff80811effffff7f821effffff7e831effffff");
    const Mons$Char_white$63 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff807f1effffff7f801effffff7f811effffff7f831effffff");
    const Mons$Char_white$64 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff807e1effffff817e1effffff7d7f1effffff7f7f1effffff817f1effffff7d801effffff7f801effffff81801effffff7d811effffff80811effffff81811effffff7d821effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$65 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff7e811effffff7f811effffff80811effffff81811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$66 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$67 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff7d7f1effffff7d801effffff7d811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$68 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$69 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff817c1effffff7d7d1effffff7d7e1effffff7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff817f1effffff7d801effffff7d811effffff7d821effffff7d831effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$70 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff817c1effffff7d7d1effffff7d7e1effffff7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff7d801effffff7d811effffff7d821effffff7d831effffff");
    const Mons$Char_white$71 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff7d7f1effffff7d801effffff7d811effffff80811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$72 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff7e7f1effffff7f7f1effffff807f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$73 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7f7d1effffff7f7e1effffff7f7f1effffff7f801effffff7f811effffff7f821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$74 = Image3D$parse$("817c1effffff817d1effffff817e1effffff817f1effffff81801effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$75 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff807d1effffff7d7e1effffff7f7e1effffff7d7f1effffff7e7f1effffff7d801effffff7f801effffff7d811effffff80811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$76 = Image3D$parse$("7d7c1effffff7d7d1effffff7d7e1effffff7d7f1effffff7d801effffff7d811effffff7d821effffff7d831effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$77 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff7e7d1effffff807d1effffff817d1effffff7d7e1effffff7f7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$78 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff7e7d1effffff817d1effffff7d7e1effffff7f7e1effffff817e1effffff7d7f1effffff807f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$79 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$80 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff7e801effffff7f801effffff80801effffff7d811effffff7d821effffff7d831effffff");
    const Mons$Char_white$81 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff80841effffff81841effffff");
    const Mons$Char_white$82 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff7e801effffff7f801effffff80801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$83 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7d7d1effffff817d1effffff7d7e1effffff7e7f1effffff7f7f1effffff80801effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$84 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff817c1effffff7f7d1effffff7f7e1effffff7f7f1effffff7f801effffff7f811effffff7f821effffff7f831effffff");
    const Mons$Char_white$85 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$86 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7e821effffff80821effffff7f831effffff");
    const Mons$Char_white$87 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff7f811effffff81811effffff7d821effffff7e821effffff80821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$88 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff817d1effffff7e7e1effffff807e1effffff7f7f1effffff7f801effffff7e811effffff80811effffff7d821effffff81821effffff7d831effffff81831effffff");
    const Mons$Char_white$89 = Image3D$parse$("7d7c1effffff817c1effffff7d7d1effffff817d1effffff7d7e1effffff817e1effffff7e7f1effffff807f1effffff7f801effffff7f811effffff7f821effffff7f831effffff");
    const Mons$Char_white$90 = Image3D$parse$("7d7c1effffff7e7c1effffff7f7c1effffff807c1effffff817c1effffff817d1effffff807e1effffff7f7f1effffff7e801effffff7e811effffff7d821effffff7d831effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$91 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff7e7d1effffff7e7e1effffff7e7f1effffff7e801effffff7e811effffff7e821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$92 = Image3D$parse$("7d7c1effffff7e7d1effffff7e7e1effffff7f7f1effffff7f801effffff80811effffff80821effffff81831effffff");
    const Mons$Char_white$93 = Image3D$parse$("7e7c1effffff7f7c1effffff807c1effffff807d1effffff807e1effffff807f1effffff80801effffff80811effffff80821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$94 = Image3D$parse$("7f7b1effffff7e7c1effffff807c1effffff7d7d1effffff817d1effffff");
    const Mons$Char_white$95 = Image3D$parse$("7d831effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$96 = Image3D$parse$("7e7b1effffff7f7c1effffff807d1effffff");
    const Mons$Char_white$97 = Image3D$parse$("7e7e1effffff7f7e1effffff807e1effffff817f1effffff7e801effffff7f801effffff80801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff81831effffff");
    const Mons$Char_white$98 = Image3D$parse$("7d7c1effffff7d7d1effffff7d7e1effffff7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff817f1effffff7d801effffff81801effffff7d811effffff81811effffff7d821effffff81821effffff7d831effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$99 = Image3D$parse$("7e7e1effffff7f7e1effffff807e1effffff7d7f1effffff817f1effffff7d801effffff7d811effffff7d821effffff81821effffff7e831effffff7f831effffff80831effffff");
    const Mons$Char_white$font = (() => {
        var _map$1 = Map$new;
        var _map$2 = Mons$font$set_img$(100, Mons$Char_white$100, _map$1);
        var _map$3 = Mons$font$set_img$(101, Mons$Char_white$101, _map$2);
        var _map$4 = Mons$font$set_img$(102, Mons$Char_white$102, _map$3);
        var _map$5 = Mons$font$set_img$(103, Mons$Char_white$103, _map$4);
        var _map$6 = Mons$font$set_img$(104, Mons$Char_white$104, _map$5);
        var _map$7 = Mons$font$set_img$(105, Mons$Char_white$105, _map$6);
        var _map$8 = Mons$font$set_img$(106, Mons$Char_white$106, _map$7);
        var _map$9 = Mons$font$set_img$(107, Mons$Char_white$107, _map$8);
        var _map$10 = Mons$font$set_img$(108, Mons$Char_white$108, _map$9);
        var _map$11 = Mons$font$set_img$(109, Mons$Char_white$109, _map$10);
        var _map$12 = Mons$font$set_img$(110, Mons$Char_white$110, _map$11);
        var _map$13 = Mons$font$set_img$(111, Mons$Char_white$111, _map$12);
        var _map$14 = Mons$font$set_img$(112, Mons$Char_white$112, _map$13);
        var _map$15 = Mons$font$set_img$(113, Mons$Char_white$113, _map$14);
        var _map$16 = Mons$font$set_img$(114, Mons$Char_white$114, _map$15);
        var _map$17 = Mons$font$set_img$(115, Mons$Char_white$115, _map$16);
        var _map$18 = Mons$font$set_img$(116, Mons$Char_white$116, _map$17);
        var _map$19 = Mons$font$set_img$(117, Mons$Char_white$117, _map$18);
        var _map$20 = Mons$font$set_img$(118, Mons$Char_white$118, _map$19);
        var _map$21 = Mons$font$set_img$(119, Mons$Char_white$119, _map$20);
        var _map$22 = Mons$font$set_img$(120, Mons$Char_white$120, _map$21);
        var _map$23 = Mons$font$set_img$(121, Mons$Char_white$121, _map$22);
        var _map$24 = Mons$font$set_img$(122, Mons$Char_white$122, _map$23);
        var _map$25 = Mons$font$set_img$(123, Mons$Char_white$123, _map$24);
        var _map$26 = Mons$font$set_img$(124, Mons$Char_white$124, _map$25);
        var _map$27 = Mons$font$set_img$(125, Mons$Char_white$125, _map$26);
        var _map$28 = Mons$font$set_img$(126, Mons$Char_white$126, _map$27);
        var _map$29 = Mons$font$set_img$(32, Mons$Char_white$32, _map$28);
        var _map$30 = Mons$font$set_img$(33, Mons$Char_white$33, _map$29);
        var _map$31 = Mons$font$set_img$(34, Mons$Char_white$34, _map$30);
        var _map$32 = Mons$font$set_img$(35, Mons$Char_white$35, _map$31);
        var _map$33 = Mons$font$set_img$(36, Mons$Char_white$36, _map$32);
        var _map$34 = Mons$font$set_img$(37, Mons$Char_white$37, _map$33);
        var _map$35 = Mons$font$set_img$(38, Mons$Char_white$38, _map$34);
        var _map$36 = Mons$font$set_img$(39, Mons$Char_white$39, _map$35);
        var _map$37 = Mons$font$set_img$(40, Mons$Char_white$40, _map$36);
        var _map$38 = Mons$font$set_img$(41, Mons$Char_white$41, _map$37);
        var _map$39 = Mons$font$set_img$(42, Mons$Char_white$42, _map$38);
        var _map$40 = Mons$font$set_img$(43, Mons$Char_white$43, _map$39);
        var _map$41 = Mons$font$set_img$(44, Mons$Char_white$44, _map$40);
        var _map$42 = Mons$font$set_img$(45, Mons$Char_white$45, _map$41);
        var _map$43 = Mons$font$set_img$(46, Mons$Char_white$46, _map$42);
        var _map$44 = Mons$font$set_img$(47, Mons$Char_white$47, _map$43);
        var _map$45 = Mons$font$set_img$(48, Mons$Char_white$48, _map$44);
        var _map$46 = Mons$font$set_img$(49, Mons$Char_white$49, _map$45);
        var _map$47 = Mons$font$set_img$(50, Mons$Char_white$50, _map$46);
        var _map$48 = Mons$font$set_img$(51, Mons$Char_white$51, _map$47);
        var _map$49 = Mons$font$set_img$(52, Mons$Char_white$52, _map$48);
        var _map$50 = Mons$font$set_img$(53, Mons$Char_white$53, _map$49);
        var _map$51 = Mons$font$set_img$(54, Mons$Char_white$54, _map$50);
        var _map$52 = Mons$font$set_img$(55, Mons$Char_white$55, _map$51);
        var _map$53 = Mons$font$set_img$(56, Mons$Char_white$56, _map$52);
        var _map$54 = Mons$font$set_img$(57, Mons$Char_white$57, _map$53);
        var _map$55 = Mons$font$set_img$(58, Mons$Char_white$58, _map$54);
        var _map$56 = Mons$font$set_img$(59, Mons$Char_white$59, _map$55);
        var _map$57 = Mons$font$set_img$(60, Mons$Char_white$60, _map$56);
        var _map$58 = Mons$font$set_img$(61, Mons$Char_white$61, _map$57);
        var _map$59 = Mons$font$set_img$(62, Mons$Char_white$62, _map$58);
        var _map$60 = Mons$font$set_img$(63, Mons$Char_white$63, _map$59);
        var _map$61 = Mons$font$set_img$(64, Mons$Char_white$64, _map$60);
        var _map$62 = Mons$font$set_img$(65, Mons$Char_white$65, _map$61);
        var _map$63 = Mons$font$set_img$(66, Mons$Char_white$66, _map$62);
        var _map$64 = Mons$font$set_img$(67, Mons$Char_white$67, _map$63);
        var _map$65 = Mons$font$set_img$(68, Mons$Char_white$68, _map$64);
        var _map$66 = Mons$font$set_img$(69, Mons$Char_white$69, _map$65);
        var _map$67 = Mons$font$set_img$(70, Mons$Char_white$70, _map$66);
        var _map$68 = Mons$font$set_img$(71, Mons$Char_white$71, _map$67);
        var _map$69 = Mons$font$set_img$(72, Mons$Char_white$72, _map$68);
        var _map$70 = Mons$font$set_img$(73, Mons$Char_white$73, _map$69);
        var _map$71 = Mons$font$set_img$(74, Mons$Char_white$74, _map$70);
        var _map$72 = Mons$font$set_img$(75, Mons$Char_white$75, _map$71);
        var _map$73 = Mons$font$set_img$(76, Mons$Char_white$76, _map$72);
        var _map$74 = Mons$font$set_img$(77, Mons$Char_white$77, _map$73);
        var _map$75 = Mons$font$set_img$(78, Mons$Char_white$78, _map$74);
        var _map$76 = Mons$font$set_img$(79, Mons$Char_white$79, _map$75);
        var _map$77 = Mons$font$set_img$(80, Mons$Char_white$80, _map$76);
        var _map$78 = Mons$font$set_img$(81, Mons$Char_white$81, _map$77);
        var _map$79 = Mons$font$set_img$(82, Mons$Char_white$82, _map$78);
        var _map$80 = Mons$font$set_img$(83, Mons$Char_white$83, _map$79);
        var _map$81 = Mons$font$set_img$(84, Mons$Char_white$84, _map$80);
        var _map$82 = Mons$font$set_img$(85, Mons$Char_white$85, _map$81);
        var _map$83 = Mons$font$set_img$(86, Mons$Char_white$86, _map$82);
        var _map$84 = Mons$font$set_img$(87, Mons$Char_white$87, _map$83);
        var _map$85 = Mons$font$set_img$(88, Mons$Char_white$88, _map$84);
        var _map$86 = Mons$font$set_img$(89, Mons$Char_white$89, _map$85);
        var _map$87 = Mons$font$set_img$(90, Mons$Char_white$90, _map$86);
        var _map$88 = Mons$font$set_img$(91, Mons$Char_white$91, _map$87);
        var _map$89 = Mons$font$set_img$(92, Mons$Char_white$92, _map$88);
        var _map$90 = Mons$font$set_img$(93, Mons$Char_white$93, _map$89);
        var _map$91 = Mons$font$set_img$(94, Mons$Char_white$94, _map$90);
        var _map$92 = Mons$font$set_img$(95, Mons$Char_white$95, _map$91);
        var _map$93 = Mons$font$set_img$(96, Mons$Char_white$96, _map$92);
        var _map$94 = Mons$font$set_img$(97, Mons$Char_white$97, _map$93);
        var _map$95 = Mons$font$set_img$(98, Mons$Char_white$98, _map$94);
        var _map$96 = Mons$font$set_img$(99, Mons$Char_white$99, _map$95);
        var _map$97 = Mons$font$set_img$(9312, Mons$Char_black$normal, _map$96);
        var _map$98 = Mons$font$set_img$(9313, Mons$Char_black$earth, _map$97);
        var _map$99 = Mons$font$set_img$(9314, Mons$Char_black$fire, _map$98);
        var _map$100 = Mons$font$set_img$(9315, Mons$Char_black$water, _map$99);
        var _map$101 = Mons$font$set_img$(9316, Mons$Char_black$grass, _map$100);
        var _map$102 = Mons$font$set_img$(9317, Mons$Char_black$electric, _map$101);
        var _map$103 = Mons$font$set_img$(9318, Mons$Char_black$psychic, _map$102);
        var _map$104 = Mons$font$set_img$(9319, Mons$Char_black$ice, _map$103);
        var _map$105 = Mons$font$set_img$(9320, Mons$Char_black$light, _map$104);
        var _map$106 = Mons$font$set_img$(9321, Mons$Char_black$darkness, _map$105);
        var $601 = _map$106;
        return $601;
    })();

    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _res$3]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [_xs$2, _res$3];
        while (true) {
            let [_xs$2, _res$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $602 = self.head;
                        var $603 = self.tail;
                        var $604 = List$reverse$go$($603, List$cons$($602, _res$3));
                        return $604;
                    case 'List.nil':
                        var $605 = _res$3;
                        return $605;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $606 = List$reverse$go$(_xs$2, List$nil);
        return $606;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Mons$Object$get_dir$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $608 = self.dir;
                var $609 = $608;
                var $607 = $609;
                break;
        };
        return $607;
    };
    const Mons$Object$get_dir = x0 => Mons$Object$get_dir$(x0);

    function Mons$draw$global_xy$(_t_x$1, _t_y$2, _obj$3) {
        var self = _obj$3;
        switch (self._) {
            case 'Mons.Object.new':
                var _ani$15 = Mons$Object$get_ani$(_obj$3);
                var _dir$16 = Mons$Object$get_dir$(_obj$3);
                var _g_x$17 = ((_t_x$1 * 16) >>> 0);
                var _g_y$18 = ((_t_y$2 * 16) >>> 0);
                var self = _dir$16;
                switch (self._) {
                    case 'Mons.Dir.right':
                        var $612 = (Math.max(_g_x$17 - _ani$15, 0));
                        var _g_x$19 = $612;
                        break;
                    case 'Mons.Dir.up':
                    case 'Mons.Dir.down':
                        var $613 = _g_x$17;
                        var _g_x$19 = $613;
                        break;
                    case 'Mons.Dir.left':
                        var $614 = ((_g_x$17 + _ani$15) >>> 0);
                        var _g_x$19 = $614;
                        break;
                };
                var self = _dir$16;
                switch (self._) {
                    case 'Mons.Dir.right':
                    case 'Mons.Dir.left':
                        var $615 = _g_y$18;
                        var _g_y$20 = $615;
                        break;
                    case 'Mons.Dir.up':
                        var $616 = ((_g_y$18 + _ani$15) >>> 0);
                        var _g_y$20 = $616;
                        break;
                    case 'Mons.Dir.down':
                        var $617 = (Math.max(_g_y$18 - _ani$15, 0));
                        var _g_y$20 = $617;
                        break;
                };
                var $611 = Pair$new$(_g_x$19, _g_y$20);
                var $610 = $611;
                break;
        };
        return $610;
    };
    const Mons$draw$global_xy = x0 => x1 => x2 => Mons$draw$global_xy$(x0, x1, x2);

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $618 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $618;
                } else {
                    var $619 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $621 = _r$3;
                        var $620 = $621;
                    } else {
                        var $622 = (self - 1n);
                        var $623 = Nat$mod$go$($622, $619, Nat$succ$(_r$3));
                        var $620 = $623;
                    };
                    return $620;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);

    function Nat$mod$(_n$1, _m$2) {
        var $624 = Nat$mod$go$(_n$1, _m$2, 0n);
        return $624;
    };
    const Nat$mod = x0 => x1 => Nat$mod$(x0, x1);

    function Either$(_A$1, _B$2) {
        var $625 = null;
        return $625;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $626 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $626;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $627 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $627;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $628 = Either$left$(_n$1);
                    return $628;
                } else {
                    var $629 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $631 = Either$right$(Nat$succ$($629));
                        var $630 = $631;
                    } else {
                        var $632 = (self - 1n);
                        var $633 = Nat$sub_rem$($632, $629);
                        var $630 = $633;
                    };
                    return $630;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $634 = self.value;
                        var $635 = Nat$div_mod$go$($634, _m$2, Nat$succ$(_d$3));
                        return $635;
                    case 'Either.right':
                        var $636 = Pair$new$(_d$3, _n$1);
                        return $636;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));
    const Nat$div = a0 => a1 => (a0 / a1);

    function Mons$draw$cur_sprite$(_idl$1, _sprites$2) {
        var _len_sprite$3 = (list_length(_sprites$2));
        var _idl_nat$4 = U32$to_nat$((Math.max(_idl$1 - 1, 0)));
        var _idx$5 = Nat$mod$((_idl_nat$4 / 4n), _len_sprite$3);
        var self = List$at$(_idx$5, _sprites$2);
        switch (self._) {
            case 'Maybe.some':
                var $638 = self.value;
                var $639 = $638;
                var $637 = $639;
                break;
            case 'Maybe.none':
                var $640 = Image3D$empty;
                var $637 = $640;
                break;
        };
        return $637;
    };
    const Mons$draw$cur_sprite = x0 => x1 => Mons$draw$cur_sprite$(x0, x1);

    function Mons$Sprite$new$(_x$1, _y$2, _z$3, _img$4) {
        var $641 = ({
            _: 'Mons.Sprite.new',
            'x': _x$1,
            'y': _y$2,
            'z': _z$3,
            'img': _img$4
        });
        return $641;
    };
    const Mons$Sprite$new = x0 => x1 => x2 => x3 => Mons$Sprite$new$(x0, x1, x2, x3);

    function Mons$game_sprites$(_game$1) {
        var self = _game$1;
        switch (self._) {
            case 'Mons.Game.new':
                var $643 = self.map;
                var $644 = self.tik;
                var _sprs$7 = List$nil;
                var self = Mons$Game$get_hero_pos$(_game$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $646 = self.value;
                        var _c_x$9 = (($646 & 0xFFF));
                        var _c_y$10 = ((($646 >>> 12) & 0xFFF));
                        var _c_z$11 = (($646 >>> 24));
                        var _sprs$12 = (() => {
                            var $648 = _sprs$7;
                            var $649 = 0;
                            var $650 = 17;
                            let _sprs$13 = $648;
                            for (let _x$12 = $649; _x$12 < $650; ++_x$12) {
                                var _sprs$14 = (() => {
                                    var $651 = _sprs$13;
                                    var $652 = 0;
                                    var $653 = 13;
                                    let _sprs$15 = $651;
                                    for (let _y$14 = $652; _y$14 < $653; ++_y$14) {
                                        var _t_x$16 = (((Math.max(_c_x$9 - 8, 0)) + _x$12) >>> 0);
                                        var _t_y$17 = (((Math.max(_c_y$10 - 6, 0)) + _y$14) >>> 0);
                                        var _t_z$18 = _c_z$11;
                                        var _pos$19 = ((0 | _t_x$16 | (_t_y$17 << 12) | (_t_z$18 << 24)));
                                        var _got$20 = Map$get$(U32$to_bits$(_pos$19), $643);
                                        var self = _got$20;
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $654 = self.value;
                                                var $655 = List$reverse$($654);
                                                var _objs$21 = $655;
                                                break;
                                            case 'Maybe.none':
                                                var $656 = List$cons$(Mons$Object$void, List$nil);
                                                var _objs$21 = $656;
                                                break;
                                        };
                                        var _sprs$22 = (() => {
                                            var $658 = _sprs$15;
                                            var $659 = _objs$21;
                                            let _sprs$23 = $658;
                                            let _obj$22;
                                            while ($659._ === 'List.cons') {
                                                _obj$22 = $659.head;
                                                var self = _obj$22;
                                                switch (self._) {
                                                    case 'Mons.Object.new':
                                                        var $660 = self.kin;
                                                        var $661 = self.dir;
                                                        var $662 = self.ani;
                                                        var self = Mons$Kind$attr$($660);
                                                        switch (self._) {
                                                            case 'Mons.Attr.new':
                                                                var $664 = self.wlk;
                                                                var _sprites$45 = $664(_t_x$16)(_t_y$17)($662)($661);
                                                                var self = Mons$draw$global_xy$(_t_x$16, _t_y$17, _obj$22);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $666 = self.fst;
                                                                        var $667 = self.snd;
                                                                        var _s_z$48 = _t_z$18;
                                                                        var self = Mons$Object$is_standing$(_obj$22);
                                                                        if (self) {
                                                                            var _cur_spr$49 = Mons$draw$cur_sprite$($644, _sprites$45);
                                                                            var _spr$50 = Mons$Sprite$new$($666, $667, _s_z$48, _cur_spr$49);
                                                                            var $669 = List$cons$(_spr$50, _sprs$23);
                                                                            var $668 = $669;
                                                                        } else {
                                                                            var _sprs$49 = (() => {
                                                                                var $672 = _sprs$23;
                                                                                var $673 = _sprites$45;
                                                                                let _sprs$50 = $672;
                                                                                let _img$49;
                                                                                while ($673._ === 'List.cons') {
                                                                                    _img$49 = $673.head;
                                                                                    var _ani$51 = Mons$Object$get_ani$(_obj$22);
                                                                                    var _dir$52 = Mons$Object$get_dir$(_obj$22);
                                                                                    var _spr$53 = Mons$Sprite$new$($666, $667, _s_z$48, _img$49);
                                                                                    var $672 = List$cons$(_spr$53, _sprs$50);
                                                                                    _sprs$50 = $672;
                                                                                    $673 = $673.tail;
                                                                                }
                                                                                return _sprs$50;
                                                                            })();
                                                                            var $670 = _sprs$49;
                                                                            var $668 = $670;
                                                                        };
                                                                        var $665 = $668;
                                                                        break;
                                                                };
                                                                var $663 = $665;
                                                                break;
                                                        };
                                                        var $658 = $663;
                                                        break;
                                                };
                                                _sprs$23 = $658;
                                                $659 = $659.tail;
                                            }
                                            return _sprs$23;
                                        })();
                                        var $651 = _sprs$22;
                                        _sprs$15 = $651;
                                    };
                                    return _sprs$15;
                                })();
                                var $648 = _sprs$14;
                                _sprs$13 = $648;
                            };
                            return _sprs$13;
                        })();
                        var $647 = _sprs$12;
                        var $645 = $647;
                        break;
                    case 'Maybe.none':
                        var $674 = List$nil;
                        var $645 = $674;
                        break;
                };
                var $642 = $645;
                break;
        };
        return $642;
    };
    const Mons$game_sprites = x0 => Mons$game_sprites$(x0);
    const Mons$scr_mid = ((0 | 120 | (80 << 12) | (0 << 24)));

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $676 = Bool$true;
                var $675 = $676;
                break;
            case 'Cmp.gtn':
                var $677 = Bool$false;
                var $675 = $677;
                break;
        };
        return $675;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $678 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $678;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U32$lte = a0 => a1 => (a0 <= a1);

    function Mons$Map$build_sprites$(_game$1, _scr$2, _hero_pos$3, _hero_obj$4) {
        var _sprs$5 = Mons$game_sprites$(_game$1);
        var _scr$6 = (() => {
            var $681 = _scr$2;
            var $682 = _sprs$5;
            let _scr$7 = $681;
            let _spr$6;
            while ($682._ === 'List.cons') {
                _spr$6 = $682.head;
                var self = _spr$6;
                switch (self._) {
                    case 'Mons.Sprite.new':
                        var $683 = self.x;
                        var $684 = self.y;
                        var $685 = self.z;
                        var $686 = self.img;
                        var _len$12 = Image3D$get_length$($686);
                        var _scr$13 = (() => {
                            var $688 = _scr$7;
                            var $689 = 0;
                            var $690 = _len$12;
                            let _scr$14 = $688;
                            for (let _i$13 = $689; _i$13 < $690; ++_i$13) {
                                var _s_w$15 = ((Mons$scr_mid & 0xFFF));
                                var _s_h$16 = (((Mons$scr_mid >>> 12) & 0xFFF));
                                var _h_x$17 = ((_hero_pos$3 & 0xFFF));
                                var _h_y$18 = (((_hero_pos$3 >>> 12) & 0xFFF));
                                var self = Mons$draw$global_xy$(_h_x$17, _h_y$18, _hero_obj$4);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $691 = self.fst;
                                        var $692 = self.snd;
                                        var _s_x$21 = $683;
                                        var _s_y$22 = $684;
                                        var _s_z$23 = $685;
                                        var _xyz$24 = (($686.buffer[_i$13 * 2]));
                                        var _v_x$25 = (Math.max(((((_xyz$24 & 0xFFF)) + _s_x$21) >>> 0) - ((Mons$vox_mid & 0xFFF)), 0));
                                        var _v_y$26 = (Math.max((((((_xyz$24 >>> 12) & 0xFFF)) + _s_y$22) >>> 0) - (((Mons$vox_mid >>> 12) & 0xFFF)), 0));
                                        var _v_z$27 = ((_xyz$24 >>> 24));
                                        var _ok0$28 = ((Math.max($691 - _s_w$15, 0)) <= _v_x$25);
                                        var _ok1$29 = (_v_x$25 < (($691 + _s_w$15) >>> 0));
                                        var _ok2$30 = ((Math.max($692 - _s_h$16, 0)) <= _v_y$26);
                                        var _ok3$31 = (_v_y$26 < (($692 + _s_h$16) >>> 0));
                                        var _ok$32 = (_ok0$28 && (_ok1$29 && (_ok2$30 && _ok3$31)));
                                        var _c_x$33 = (Math.max(((_v_x$25 + ((Mons$scr_mid & 0xFFF))) >>> 0) - $691, 0));
                                        var _c_y$34 = (Math.max(((_v_y$26 + (((Mons$scr_mid >>> 12) & 0xFFF))) >>> 0) - $692, 0));
                                        var _c_z$35 = (_ok$32 ? _v_z$27 : 0);
                                        var _pos$36 = ((0 | _c_x$33 | (_c_y$34 << 12) | (_c_z$35 << 24)));
                                        var _col$37 = (($686.buffer[_i$13 * 2 + 1]));
                                        var $693 = ((_scr$14.buffer[_scr$14.length * 2] = _pos$36, _scr$14.buffer[_scr$14.length * 2 + 1] = _col$37, _scr$14.length++, _scr$14));
                                        var $688 = $693;
                                        break;
                                };
                                _scr$14 = $688;
                            };
                            return _scr$14;
                        })();
                        var $687 = _scr$13;
                        var $681 = $687;
                        break;
                };
                _scr$7 = $681;
                $682 = $682.tail;
            }
            return _scr$7;
        })();
        var $679 = _scr$6;
        return $679;
    };
    const Mons$Map$build_sprites = x0 => x1 => x2 => x3 => Mons$Map$build_sprites$(x0, x1, x2, x3);
    const Mons$draw$text_screen_bg = Image3D$empty;
    const Mons$draw$msg_screen$line_0 = ((0 | 16 | (128 << 12) | (0 << 24)));
    const Mons$draw$msg_screen$line_1 = ((0 | 16 | (144 << 12) | (0 << 24)));

    function Mons$draw$mage_talk$(_text_0$1, _text_1$2, _scr$3) {
        var _battle_boy_u$4 = Image3D$empty;
        var _battle_mage_d$5 = Image3D$empty;
        var _scr$6 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$3);
        var _scr$7 = Mons$draw$text$(_text_0$1, Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$6);
        var _scr$8 = Mons$draw$text$(_text_1$2, Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$7);
        var _scr$9 = Mons$draw$image$(_battle_boy_u$4, ((0 | 75 | (85 << 12) | (0 << 24))), _scr$8);
        var _scr$10 = Mons$draw$image$(_battle_mage_d$5, ((0 | 180 | (80 << 12) | (0 << 24))), _scr$9);
        var $694 = _scr$10;
        return $694;
    };
    const Mons$draw$mage_talk = x0 => x1 => x2 => Mons$draw$mage_talk$(x0, x1, x2);

    function Mons$Object$get_images$(_bag$1) {
        var _images$2 = List$nil;
        var _images$3 = (() => {
            var $697 = _images$2;
            var $698 = _bag$1;
            let _images$4 = $697;
            let _mon$3;
            while ($698._ === 'List.cons') {
                _mon$3 = $698.head;
                var self = _mon$3;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $699 = self.kin;
                        var self = Mons$Kind$attr$($699);
                        switch (self._) {
                            case 'Mons.Attr.new':
                                var $701 = self.pic;
                                var $702 = List$cons$($701, _images$4);
                                var $700 = $702;
                                break;
                        };
                        var $697 = $700;
                        break;
                };
                _images$4 = $697;
                $698 = $698.tail;
            }
            return _images$4;
        })();
        var $695 = _images$3;
        return $695;
    };
    const Mons$Object$get_images = x0 => Mons$Object$get_images$(x0);

    function Mons$Kind$get_name$(_kind$1) {
        var self = Mons$Kind$attr$(_kind$1);
        switch (self._) {
            case 'Mons.Attr.new':
                var $704 = self.name;
                var $705 = $704;
                var $703 = $705;
                break;
        };
        return $703;
    };
    const Mons$Kind$get_name = x0 => Mons$Kind$get_name$(x0);

    function Mons$Object$get_names$(_bag$1) {
        var _names$2 = List$nil;
        var _names$3 = (() => {
            var $708 = _names$2;
            var $709 = _bag$1;
            let _names$4 = $708;
            let _mon$3;
            while ($709._ === 'List.cons') {
                _mon$3 = $709.head;
                var self = _mon$3;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $710 = self.kin;
                        var _name$16 = Mons$Kind$get_name$($710);
                        var $711 = List$cons$(_name$16, _names$4);
                        var $708 = $711;
                        break;
                };
                _names$4 = $708;
                $709 = $709.tail;
            }
            return _names$4;
        })();
        var $706 = _names$3;
        return $706;
    };
    const Mons$Object$get_names = x0 => Mons$Object$get_names$(x0);

    function Mons$draw$list_image$go$(_images$1, _horizontal$2, _spacing$3, _pos$4, _scr$5, _idx$6) {
        var Mons$draw$list_image$go$ = (_images$1, _horizontal$2, _spacing$3, _pos$4, _scr$5, _idx$6) => ({
            ctr: 'TCO',
            arg: [_images$1, _horizontal$2, _spacing$3, _pos$4, _scr$5, _idx$6]
        });
        var Mons$draw$list_image$go = _images$1 => _horizontal$2 => _spacing$3 => _pos$4 => _scr$5 => _idx$6 => Mons$draw$list_image$go$(_images$1, _horizontal$2, _spacing$3, _pos$4, _scr$5, _idx$6);
        var arg = [_images$1, _horizontal$2, _spacing$3, _pos$4, _scr$5, _idx$6];
        while (true) {
            let [_images$1, _horizontal$2, _spacing$3, _pos$4, _scr$5, _idx$6] = arg;
            var R = (() => {
                var _x$7 = ((_pos$4 & 0xFFF));
                var _y$8 = (((_pos$4 >>> 12) & 0xFFF));
                var self = _images$1;
                switch (self._) {
                    case 'List.cons':
                        var $713 = self.head;
                        var $714 = self.tail;
                        var _inventory_mon_selection$11 = Image3D$empty;
                        var _scr$12 = Mons$draw$image$(_inventory_mon_selection$11, _pos$4, _scr$5);
                        var _scr$13 = Mons$draw$image$($713, _pos$4, _scr$12);
                        var self = _horizontal$2;
                        if (self) {
                            var $716 = ((0 | ((_x$7 + _spacing$3) >>> 0) | (_y$8 << 12) | (0 << 24)));
                            var _pos$14 = $716;
                        } else {
                            var $717 = ((0 | _x$7 | (((_y$8 + _spacing$3) >>> 0) << 12) | (0 << 24)));
                            var _pos$14 = $717;
                        };
                        var $715 = Mons$draw$list_image$go$($714, _horizontal$2, _spacing$3, _pos$14, _scr$13, ((_idx$6 + 1) >>> 0));
                        var $712 = $715;
                        break;
                    case 'List.nil':
                        var $718 = _scr$5;
                        var $712 = $718;
                        break;
                };
                return $712;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Mons$draw$list_image$go = x0 => x1 => x2 => x3 => x4 => x5 => Mons$draw$list_image$go$(x0, x1, x2, x3, x4, x5);

    function Mons$draw$list_image$(_images$1, _horizontal$2, _spacing$3, _start_pos$4, _scr$5) {
        var _qtd$6 = (Number((list_length(_images$1))));
        var $719 = Mons$draw$list_image$go$(_images$1, _horizontal$2, _spacing$3, _start_pos$4, _scr$5, 0);
        return $719;
    };
    const Mons$draw$list_image = x0 => x1 => x2 => x3 => x4 => Mons$draw$list_image$(x0, x1, x2, x3, x4);

    function Mons$draw$mon_img_selected$(_mon_idx$1, _qtd$2, _horizontal$3, _spacing$4, _pos$5, _scr$6) {
        var _x_pos$7 = ((_pos$5 & 0xFFF));
        var _y_pos$8 = (((_pos$5 >>> 12) & 0xFFF));
        var self = (_mon_idx$1 === 0);
        if (self) {
            var $721 = ((0 | _x_pos$7 | (_y_pos$8 << 12) | (0 << 24)));
            var _pos$9 = $721;
        } else {
            var self = _horizontal$3;
            if (self) {
                var $723 = ((0 | ((_x_pos$7 + ((_spacing$4 * _mon_idx$1) >>> 0)) >>> 0) | (_y_pos$8 << 12) | (0 << 24)));
                var $722 = $723;
            } else {
                var $724 = ((0 | _x_pos$7 | (((_y_pos$8 + ((_spacing$4 * _mon_idx$1) >>> 0)) >>> 0) << 12) | (0 << 24)));
                var $722 = $724;
            };
            var _pos$9 = $722;
        };
        var self = (_qtd$2 === 0);
        if (self) {
            var $725 = _scr$6;
            var $720 = $725;
        } else {
            var _inventory_mon_selected$10 = Image3D$empty;
            var $726 = Mons$draw$image$(_inventory_mon_selected$10, _pos$9, _scr$6);
            var $720 = $726;
        };
        return $720;
    };
    const Mons$draw$mon_img_selected = x0 => x1 => x2 => x3 => x4 => x5 => Mons$draw$mon_img_selected$(x0, x1, x2, x3, x4, x5);

    function Mons$draw$initial_mons$(_obj$1, _scr$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $728 = self.bag;
                var $729 = self.mon;
                var _qtd$14 = (Number((list_length($728))));
                var self = (_qtd$14 === 0);
                if (self) {
                    var $731 = Mons$draw$text$("nothing to show", Mons$Char_white$font, ((0 | 60 | (50 << 12) | (0 << 24))), _scr$2);
                    var $730 = $731;
                } else {
                    var _scr$15 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (90 << 12) | (0 << 24))), _scr$2);
                    var _mons_images$16 = List$reverse$(Mons$Object$get_images$($728));
                    var _mons_names$17 = List$reverse$(Mons$Object$get_names$($728));
                    var _scr$18 = Mons$draw$list$(_mons_names$17, Bool$false, 34, Mons$Char_white$font, ((0 | 70 | (0 << 12) | (0 << 24))), _scr$15);
                    var _scr$19 = Mons$draw$list_image$(_mons_images$16, Bool$false, 34, ((0 | 40 | (30 << 12) | (0 << 24))), _scr$18);
                    var _scr$20 = Mons$draw$mon_img_selected$($729, _qtd$14, Bool$false, 34, ((0 | 40 | (30 << 12) | (0 << 24))), _scr$19);
                    var _scr$21 = Mons$draw$text$("Choose a Mon to start with and ", Mons$Char_black$font, ((0 | 16 | (134 << 12) | (0 << 24))), _scr$20);
                    var _scr$22 = Mons$draw$text$("run to the tower. [c]", Mons$Char_black$font, ((0 | 16 | (148 << 12) | (0 << 24))), _scr$21);
                    var $732 = _scr$22;
                    var $730 = $732;
                };
                var $727 = $730;
                break;
        };
        return $727;
    };
    const Mons$draw$initial_mons = x0 => x1 => Mons$draw$initial_mons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function String$flatten$go$(_xs$1, _res$2) {
        var String$flatten$go$ = (_xs$1, _res$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _res$2]
        });
        var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
        var arg = [_xs$1, _res$2];
        while (true) {
            let [_xs$1, _res$2] = arg;
            var R = (() => {
                var self = _xs$1;
                switch (self._) {
                    case 'List.cons':
                        var $733 = self.head;
                        var $734 = self.tail;
                        var $735 = String$flatten$go$($734, (_res$2 + $733));
                        return $735;
                    case 'List.nil':
                        var $736 = _res$2;
                        return $736;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $737 = String$flatten$go$(_xs$1, "");
        return $737;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function Mons$draw$img_type$(_kind$1) {
        var self = _kind$1;
        switch (self._) {
            case 'Mons.Kind.Mons':
                var $739 = self.pri_type;
                var self = $739;
                switch (self._) {
                    case 'Mons.Type.normal':
                        var $741 = "\u{2460}";
                        var $740 = $741;
                        break;
                    case 'Mons.Type.earth':
                        var $742 = "\u{2461}";
                        var $740 = $742;
                        break;
                    case 'Mons.Type.fire':
                        var $743 = "\u{2462}";
                        var $740 = $743;
                        break;
                    case 'Mons.Type.water':
                        var $744 = "\u{2463}";
                        var $740 = $744;
                        break;
                    case 'Mons.Type.grass':
                        var $745 = "\u{2464}";
                        var $740 = $745;
                        break;
                    case 'Mons.Type.electric':
                        var $746 = "\u{2465}";
                        var $740 = $746;
                        break;
                    case 'Mons.Type.psychic':
                        var $747 = "\u{2466}";
                        var $740 = $747;
                        break;
                    case 'Mons.Type.ice':
                        var $748 = "\u{2467}";
                        var $740 = $748;
                        break;
                    case 'Mons.Type.light':
                        var $749 = "\u{2468}";
                        var $740 = $749;
                        break;
                    case 'Mons.Type.darkness':
                        var $750 = "\u{2469}";
                        var $740 = $750;
                        break;
                };
                var $738 = $740;
                break;
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Terrain':
            case 'Mons.Kind.Interactive':
                var $751 = "";
                var $738 = $751;
                break;
        };
        return $738;
    };
    const Mons$draw$img_type = x0 => Mons$draw$img_type$(x0);
    const Mons$draw$small_HP = "\u{195}\u{1a5}";

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $753 = self.head;
                var $754 = self.tail;
                var $755 = _cons$5($753)(List$fold$($754, _nil$4, _cons$5));
                var $752 = $755;
                break;
            case 'List.nil':
                var $756 = _nil$4;
                var $752 = $756;
                break;
        };
        return $752;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_base$1, _nat$2, _res$3]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [_base$1, _nat$2, _res$3];
        while (true) {
            let [_base$1, _nat$2, _res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': _nat$2 / _base$1,
                    'snd': _nat$2 % _base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $757 = self.fst;
                        var $758 = self.snd;
                        var self = $757;
                        if (self === 0n) {
                            var $760 = List$cons$($758, _res$3);
                            var $759 = $760;
                        } else {
                            var $761 = (self - 1n);
                            var $762 = Nat$to_base$go$(_base$1, $757, List$cons$($758, _res$3));
                            var $759 = $762;
                        };
                        return $759;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $763 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $763;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);
    const Nat$gtn = a0 => a1 => (a0 > a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = Nat$mod$(_n$2, _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $766 = self.value;
                    var $767 = $766;
                    var $765 = $767;
                    break;
                case 'Maybe.none':
                    var $768 = 35;
                    var $765 = $768;
                    break;
            };
            var $764 = $765;
        } else {
            var $769 = 35;
            var $764 = $769;
        };
        return $764;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $770 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $771 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $771;
        }));
        return $770;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function U32$to_string$(_n$1) {
        var $772 = Nat$to_string_base$(10n, U32$to_nat$(_n$1));
        return $772;
    };
    const U32$to_string = x0 => U32$to_string$(x0);
    const Bool$not = a0 => (!a0);

    function Mons$Object$remaining_hp$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $774 = self.kin;
                var $775 = self.dmg;
                var self = $774;
                switch (self._) {
                    case 'Mons.Kind.Mons':
                        var self = Mons$Kind$attr$($774);
                        switch (self._) {
                            case 'Mons.Attr.new':
                                var $778 = self.mhp;
                                var $779 = (Math.max($778 - $775, 0));
                                var $777 = $779;
                                break;
                        };
                        var $776 = $777;
                        break;
                    case 'Mons.Kind.Const':
                    case 'Mons.Kind.Terrain':
                    case 'Mons.Kind.Interactive':
                        var $780 = $775;
                        var $776 = $780;
                        break;
                };
                var $773 = $776;
                break;
        };
        return $773;
    };
    const Mons$Object$remaining_hp = x0 => Mons$Object$remaining_hp$(x0);

    function Mons$Object$is_obj_defeated$(_obj$1) {
        var $781 = (Mons$Object$remaining_hp$(_obj$1) === 0);
        return $781;
    };
    const Mons$Object$is_obj_defeated = x0 => Mons$Object$is_obj_defeated$(x0);

    function Mons$Object$is_battling$(_adve$1, _hero_or_mon$2) {
        var _is_adve_alive$3 = (!Mons$Object$is_obj_defeated$(_adve$1));
        var _is_hero_alive$4 = (!Mons$Object$is_obj_defeated$(_hero_or_mon$2));
        var $782 = (_is_adve_alive$3 && _is_hero_alive$4);
        return $782;
    };
    const Mons$Object$is_battling = x0 => x1 => Mons$Object$is_battling$(x0, x1);

    function Mons$draw$background$(_idx$1) {
        var self = (_idx$1 === 1);
        if (self) {
            var $784 = Pair$new$(Image3D$empty, Image3D$empty);
            var $783 = $784;
        } else {
            var self = (_idx$1 === 2);
            if (self) {
                var $786 = Pair$new$(Image3D$empty, Image3D$empty);
                var $785 = $786;
            } else {
                var $787 = Pair$new$(Image3D$empty, Image3D$empty);
                var $785 = $787;
            };
            var $783 = $785;
        };
        return $783;
    };
    const Mons$draw$background = x0 => Mons$draw$background$(x0);

    function Mons$draw$get_battle_bg$(_idx$1) {
        var $788 = Pair$fst$(Mons$draw$background$(_idx$1));
        return $788;
    };
    const Mons$draw$get_battle_bg = x0 => Mons$draw$get_battle_bg$(x0);

    function Mons$draw$battle_bg$(_adve_kind$1, _is_boss$2, _idx$3, _scr$4) {
        var _screen$battle_default$5 = Image3D$empty;
        var _screen$battle_boss$6 = Image3D$empty;
        var _scr$7 = Mons$draw$image$(Mons$draw$get_battle_bg$(_idx$3), ((0 | 120 | (80 << 12) | (0 << 24))), _scr$4);
        var self = _is_boss$2;
        if (self) {
            var $790 = Mons$draw$image$(_screen$battle_boss$6, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$7);
            var _scr$8 = $790;
        } else {
            var $791 = Mons$draw$image$(_screen$battle_default$5, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$7);
            var _scr$8 = $791;
        };
        var $789 = _scr$8;
        return $789;
    };
    const Mons$draw$battle_bg = x0 => x1 => x2 => x3 => Mons$draw$battle_bg$(x0, x1, x2, x3);

    function Mons$draw$hero_hp$(_chp$1, _mhp$2, _name$3, _hero_hp$4, _scr$5) {
        var _battle_hp$6 = Image3D$empty;
        var _p_hp$7 = ((((_chp$1 * 70) >>> 0) / _mhp$2) >>> 0);
        var _pos_chp$8 = ((0 | ((100 + _p_hp$7) >>> 0) | (82 << 12) | (0 << 24)));
        var _pos_name$9 = ((0 | 139 | (82 << 12) | (0 << 24)));
        var _scr$10 = Mons$draw$image$(_battle_hp$6, _pos_chp$8, _scr$5);
        var _scr$11 = Mons$draw$text$(_name$3, Mons$Char_white$font, _pos_name$9, _scr$10);
        var _scr$12 = Mons$draw$text$(_hero_hp$4, Mons$Char_black$font, ((0 | 139 | (97 << 12) | (0 << 24))), _scr$11);
        var $792 = _scr$12;
        return $792;
    };
    const Mons$draw$hero_hp = x0 => x1 => x2 => x3 => x4 => Mons$draw$hero_hp$(x0, x1, x2, x3, x4);

    function Mons$draw$adve_hp$(_chp$1, _mhp$2, _name$3, _adve_hp$4, _scr$5) {
        var _battle_hp$6 = Image3D$empty;
        var _p_hp$7 = ((((_chp$1 * 70) >>> 0) / _mhp$2) >>> 0);
        var _pos_chp$8 = ((0 | _p_hp$7 | (21 << 12) | (0 << 24)));
        var _pos_name$9 = ((0 | 38 | (21 << 12) | (0 << 24)));
        var _scr$10 = Mons$draw$image$(_battle_hp$6, _pos_chp$8, _scr$5);
        var _scr$11 = Mons$draw$text$(_name$3, Mons$Char_white$font, _pos_name$9, _scr$10);
        var _scr$12 = Mons$draw$text$(_adve_hp$4, Mons$Char_black$font, ((0 | 38 | (36 << 12) | (0 << 24))), _scr$11);
        var $793 = _scr$12;
        return $793;
    };
    const Mons$draw$adve_hp = x0 => x1 => x2 => x3 => x4 => Mons$draw$adve_hp$(x0, x1, x2, x3, x4);

    function Mons$draw$effect$(_eff$1, _pos$2, _scr$3) {
        var $794 = _scr$3;
        return $794;
    };
    const Mons$draw$effect = x0 => x1 => x2 => Mons$draw$effect$(x0, x1, x2);

    function Mons$draw$effects$(_hero_eff$1, _adve_eff$2, _scr$3) {
        var _scr$4 = Mons$draw$effect$(_hero_eff$1, ((0 | 140 | (105 << 12) | (0 << 24))), _scr$3);
        var _scr$5 = Mons$draw$effect$(_adve_eff$2, ((0 | 38 | (45 << 12) | (0 << 24))), _scr$4);
        var $795 = _scr$5;
        return $795;
    };
    const Mons$draw$effects = x0 => x1 => x2 => Mons$draw$effects$(x0, x1, x2);

    function Mons$Turn$is_active$(_turn$1) {
        var self = _turn$1;
        switch (self._) {
            case 'Mons.Turn.new':
                var $797 = self.play;
                var $798 = ($797 > 0);
                var $796 = $798;
                break;
        };
        return $796;
    };
    const Mons$Turn$is_active = x0 => Mons$Turn$is_active$(x0);

    function Mons$Turn$hero_turn$(_turn$1) {
        var self = _turn$1;
        switch (self._) {
            case 'Mons.Turn.new':
                var $800 = self.exec_hero;
                var $801 = $800;
                var $799 = $801;
                break;
        };
        return $799;
    };
    const Mons$Turn$hero_turn = x0 => Mons$Turn$hero_turn$(x0);

    function Mons$Skill$get_name$(_skill$1) {
        var self = _skill$1;
        switch (self._) {
            case 'Mons.Skill.hit_4':
                var $803 = "hit 4";
                var $802 = $803;
                break;
            case 'Mons.Skill.hit_2':
                var $804 = "hit 2";
                var $802 = $804;
                break;
            case 'Mons.Skill.heal':
                var $805 = "heal";
                var $802 = $805;
                break;
            case 'Mons.Skill.none':
                var $806 = "none";
                var $802 = $806;
                break;
            case 'Mons.Skill.run':
                var $807 = "Run";
                var $802 = $807;
                break;
            case 'Mons.Skill.dig':
                var $808 = "Dig";
                var $802 = $808;
                break;
            case 'Mons.Skill.sand_tomb':
                var $809 = "Sand bomb";
                var $802 = $809;
                break;
            case 'Mons.Skill.protect':
                var $810 = "Protect";
                var $802 = $810;
                break;
            case 'Mons.Skill.slam':
                var $811 = "Slam";
                var $802 = $811;
                break;
            case 'Mons.Skill.counter':
                var $812 = "Counter";
                var $802 = $812;
                break;
            case 'Mons.Skill.recover':
                var $813 = "Recover";
                var $802 = $813;
                break;
            case 'Mons.Skill.rock_smash':
                var $814 = "Rock Smash";
                var $802 = $814;
                break;
            case 'Mons.Skill.crunch':
                var $815 = "Crunch";
                var $802 = $815;
                break;
            case 'Mons.Skill.sludge_bomb':
                var $816 = "Sludge bomb";
                var $802 = $816;
                break;
            case 'Mons.Skill.gyro_ball':
                var $817 = "Gyro Ball";
                var $802 = $817;
                break;
            case 'Mons.Skill.iron_defense':
                var $818 = "Iron Defense";
                var $802 = $818;
                break;
            case 'Mons.Skill.super_fang':
                var $819 = "Super Fang";
                var $802 = $819;
                break;
            case 'Mons.Skill.hypnosis':
                var $820 = "Hypnosis";
                var $802 = $820;
                break;
            case 'Mons.Skill.dream_eater':
                var $821 = "Dream Eater";
                var $802 = $821;
                break;
            case 'Mons.Skill.wing_attack':
                var $822 = "Wing Attack";
                var $802 = $822;
                break;
            case 'Mons.Skill.moonlight':
                var $823 = "Moonlight";
                var $802 = $823;
                break;
            case 'Mons.Skill.play_rough':
                var $824 = "Play Rough";
                var $802 = $824;
                break;
            case 'Mons.Skill.psychic':
                var $825 = "Psychic";
                var $802 = $825;
                break;
            case 'Mons.Skill.ancient_power':
                var $826 = "Ancient Power";
                var $802 = $826;
                break;
            case 'Mons.Skill.thunder_wave':
                var $827 = "Thunder Wave";
                var $802 = $827;
                break;
            case 'Mons.Skill.charge':
                var $828 = "Charge";
                var $802 = $828;
                break;
            case 'Mons.Skill.agility':
                var $829 = "Agility";
                var $802 = $829;
                break;
            case 'Mons.Skill.hero_kill':
                var $830 = "ONE PUNCH";
                var $802 = $830;
                break;
            case 'Mons.Skill.nightmare':
                var $831 = "Nightmare";
                var $802 = $831;
                break;
        };
        return $802;
    };
    const Mons$Skill$get_name = x0 => Mons$Skill$get_name$(x0);

    function Mons$Skill$short_description$(_skill$1) {
        var self = _skill$1;
        switch (self._) {
            case 'Mons.Skill.hit_4':
                var $833 = "damage 4";
                var $832 = $833;
                break;
            case 'Mons.Skill.hit_2':
                var $834 = "damage 2";
                var $832 = $834;
                break;
            case 'Mons.Skill.heal':
                var $835 = "heal 3";
                var $832 = $835;
                break;
            case 'Mons.Skill.none':
                var $836 = "does nothing";
                var $832 = $836;
                break;
            case 'Mons.Skill.run':
                var $837 = "Run from battle";
                var $832 = $837;
                break;
            case 'Mons.Skill.dig':
                var $838 = "Add hit next turn, add invul";
                var $832 = $838;
                break;
            case 'Mons.Skill.sand_tomb':
                var $839 = "Dmg this turn + burn(5)";
                var $832 = $839;
                break;
            case 'Mons.Skill.protect':
                var $840 = "-50% dmg next turn";
                var $832 = $840;
                break;
            case 'Mons.Skill.slam':
            case 'Mons.Skill.wing_attack':
                var $841 = "Hit 6hp";
                var $832 = $841;
                break;
            case 'Mons.Skill.counter':
                var $842 = "Burn for 5 turns and heal 3hp";
                var $832 = $842;
                break;
            case 'Mons.Skill.recover':
                var $843 = "Restore 25% hp, add poison";
                var $832 = $843;
                break;
            case 'Mons.Skill.rock_smash':
                var $844 = "Hit 2hp + 50% of critical";
                var $832 = $844;
                break;
            case 'Mons.Skill.crunch':
                var $845 = "Hit 4hp + 25% of critical";
                var $832 = $845;
                break;
            case 'Mons.Skill.sludge_bomb':
                var $846 = "Hit 2hp + 30% of poisoning";
                var $832 = $846;
                break;
            case 'Mons.Skill.gyro_ball':
                var $847 = "Hit 4. If more agility + 50% dmg";
                var $832 = $847;
                break;
            case 'Mons.Skill.iron_defense':
                var $848 = "-25% dmg for this and next turn";
                var $832 = $848;
                break;
            case 'Mons.Skill.super_fang':
                var $849 = "Hit 50% hp + loses 25% of hp";
                var $832 = $849;
                break;
            case 'Mons.Skill.hypnosis':
                var $850 = "50% of sleep if can";
                var $832 = $850;
                break;
            case 'Mons.Skill.dream_eater':
                var $851 = "If sleep, hit 6 and heal 4";
                var $832 = $851;
                break;
            case 'Mons.Skill.moonlight':
                var $852 = "Hit 4 + 20% of sleep";
                var $832 = $852;
                break;
            case 'Mons.Skill.play_rough':
                var $853 = "Hit 4 + 20% of critical";
                var $832 = $853;
                break;
            case 'Mons.Skill.psychic':
                var $854 = "Hit 2hp + 10% sleep and hit";
                var $832 = $854;
                break;
            case 'Mons.Skill.ancient_power':
                var $855 = "Hit 4hp + 10% adve miss the attack";
                var $832 = $855;
                break;
            case 'Mons.Skill.thunder_wave':
                var $856 = "Hit 6";
                var $832 = $856;
                break;
            case 'Mons.Skill.charge':
                var $857 = "Hit4, if adve has minimize, hit8";
                var $832 = $857;
                break;
            case 'Mons.Skill.agility':
                var $858 = "Invert Mon\'s agitity value";
                var $832 = $858;
                break;
            case 'Mons.Skill.hero_kill':
                var $859 = "Herro atk";
                var $832 = $859;
                break;
            case 'Mons.Skill.nightmare':
                var $860 = "If sleep damage hit 20% hp";
                var $832 = $860;
                break;
        };
        return $832;
    };
    const Mons$Skill$short_description = x0 => Mons$Skill$short_description$(x0);

    function Mons$draw$turn$(_name$1, _skill$2, _scr$3) {
        var _msg$4 = String$flatten$(List$cons$(_name$1, List$cons$(" used ", List$cons$(Mons$Skill$get_name$(_skill$2), List$cons$(".", List$nil)))));
        var _scr$5 = Mons$draw$text$(_msg$4, Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$3);
        var _desc$6 = Mons$Skill$short_description$(_skill$2);
        var $861 = Mons$draw$text$(String$flatten$(List$cons$(_desc$6, List$cons$("  [c]", List$nil))), Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$5);
        return $861;
    };
    const Mons$draw$turn = x0 => x1 => x2 => Mons$draw$turn$(x0, x1, x2);

    function Mons$Kind$get_skills$(_kind$1) {
        var self = Mons$Kind$attr$(_kind$1);
        switch (self._) {
            case 'Mons.Attr.new':
                var $863 = self.skills;
                var $864 = $863;
                var $862 = $864;
                break;
        };
        return $862;
    };
    const Mons$Kind$get_skills = x0 => Mons$Kind$get_skills$(x0);

    function Mons$Game$get_skills_at$(_idx$1, _obj$2) {
        var self = _obj$2;
        switch (self._) {
            case 'Mons.Object.new':
                var $866 = self.kin;
                var _skills$14 = Mons$Kind$get_skills$($866);
                var self = List$at$(_idx$1, _skills$14);
                switch (self._) {
                    case 'Maybe.some':
                        var $868 = self.value;
                        var $869 = $868;
                        var $867 = $869;
                        break;
                    case 'Maybe.none':
                        var $870 = Mons$Skill$none;
                        var $867 = $870;
                        break;
                };
                var $865 = $867;
                break;
        };
        return $865;
    };
    const Mons$Game$get_skills_at = x0 => x1 => Mons$Game$get_skills_at$(x0, x1);

    function Mons$draw$battle_skills$(_hero_obj$1, _scr$2) {
        var _u$3 = Mons$Skill$get_name$(Mons$Game$get_skills_at$(0n, _hero_obj$1));
        var _i$4 = Mons$Skill$get_name$(Mons$Game$get_skills_at$(1n, _hero_obj$1));
        var _j$5 = Mons$Skill$get_name$(Mons$Game$get_skills_at$(2n, _hero_obj$1));
        var _k$6 = Mons$Skill$get_name$(Mons$Game$get_skills_at$(3n, _hero_obj$1));
        var _scr$7 = Mons$draw$text$(String$flatten$(List$cons$("[u] ", List$cons$(_u$3, List$cons$("   [i] ", List$cons$(_i$4, List$nil))))), Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$2);
        var $871 = Mons$draw$text$(String$flatten$(List$cons$("[j] ", List$cons$(_j$5, List$cons$("   [k] ", List$cons$(_k$6, List$nil))))), Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$7);
        return $871;
    };
    const Mons$draw$battle_skills = x0 => x1 => Mons$draw$battle_skills$(x0, x1);

    function Mons$draw$get_full_bg$(_idx$1) {
        var $872 = Pair$snd$(Mons$draw$background$(_idx$1));
        return $872;
    };
    const Mons$draw$get_full_bg = x0 => Mons$draw$get_full_bg$(x0);

    function Mons$draw$capture_bg$(_adve_kind$1, _idx$2, _scr$3) {
        var _scr$4 = Mons$draw$image$(Mons$draw$get_full_bg$(_idx$2), ((0 | 120 | (80 << 12) | (0 << 24))), _scr$3);
        var _sct$5 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$4);
        var $873 = _scr$4;
        return $873;
    };
    const Mons$draw$capture_bg = x0 => x1 => x2 => Mons$draw$capture_bg$(x0, x1, x2);

    function Mons$draw$battle_win_bg$(_adve_kind$1, _idx$2, _scr$3) {
        var _battle_win$4 = Image3D$empty;
        var _scr$5 = Mons$draw$image$(Mons$draw$get_full_bg$(_idx$2), ((0 | 120 | (80 << 12) | (0 << 24))), _scr$3);
        var _scr$6 = Mons$draw$image$(_battle_win$4, ((0 | 70 | (90 << 12) | (0 << 24))), _scr$5);
        var _scr$7 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$6);
        var $874 = _scr$7;
        return $874;
    };
    const Mons$draw$battle_win_bg = x0 => x1 => x2 => Mons$draw$battle_win_bg$(x0, x1, x2);

    function Mons$Kind$is_portal$(_adve_kin$1) {
        var self = _adve_kin$1;
        switch (self._) {
            case 'Mons.Kind.Const':
                var $876 = self.ele;
                var self = $876;
                switch (self._) {
                    case 'Mons.Kind.const.FOUNTAIN':
                    case 'Mons.Kind.const.CHEST':
                    case 'Mons.Kind.const.CRYSTAL':
                        var $878 = Bool$false;
                        var $877 = $878;
                        break;
                    case 'Mons.Kind.const.PORTAL':
                        var $879 = Bool$true;
                        var $877 = $879;
                        break;
                };
                var $875 = $877;
                break;
            case 'Mons.Kind.Mons':
            case 'Mons.Kind.Terrain':
            case 'Mons.Kind.Interactive':
                var $880 = Bool$false;
                var $875 = $880;
                break;
        };
        return $875;
    };
    const Mons$Kind$is_portal = x0 => Mons$Kind$is_portal$(x0);
    const Bool$or = a0 => a1 => (a0 || a1);

    function Mons$Game$defeated_lvl_mons$(_qtd_defeated$1, _dim$2) {
        var self = (_dim$2 === 0);
        if (self) {
            var $882 = Bool$true;
            var $881 = $882;
        } else {
            var self = (_dim$2 === 1);
            if (self) {
                var $884 = Bool$true;
                var $883 = $884;
            } else {
                var $885 = Bool$false;
                var $883 = $885;
            };
            var $881 = $883;
        };
        return $881;
    };
    const Mons$Game$defeated_lvl_mons = x0 => x1 => Mons$Game$defeated_lvl_mons$(x0, x1);
    const Mons$Assets$void = Image3D$parse$("7878021012167978021012167a78021012167b78021012167c78021012167d78021012167e78021012167f78021012168078021012168178021012168278021012168378021012168478021012168578021012168678021012168778021012167879021012167979021012167a79021012167b79021012167c79021012167d79021012167e79021012167f7902101216807902101216817902101216827902101216837902101216847902101216857902101216867902101216877902101216787a02101216797a021012167a7a021012167b7a021012167c7a021012167d7a021012167e7a021012167f7a02101216807a02101216817a02101216827a02101216837a02101216847a02101216857a02101216867a02101216877a02101216787b02101216797b021012167a7b021012167b7b021012167c7b021012167d7b021012167e7b021012167f7b02101216807b02101216817b02101216827b02101216837b02101216847b02101216857b02101216867b02101216877b02101216787c02101216797c021012167a7c021012167b7c021012167c7c021012167d7c021012167e7c021012167f7c02101216807c02101216817c02101216827c02101216837c02101216847c02101216857c02101216867c02101216877c02101216787d02101216797d021012167a7d021012167b7d021012167c7d021012167d7d021012167e7d021012167f7d02101216807d02101216817d02101216827d02101216837d02101216847d02101216857d02101216867d02101216877d02101216787e02101216797e021012167a7e021012167b7e021012167c7e021012167d7e021012167e7e021012167f7e02101216807e02101216817e02101216827e02101216837e02101216847e02101216857e02101216867e02101216877e02101216787f02101216797f021012167a7f021012167b7f021012167c7f021012167d7f021012167e7f021012167f7f02101216807f02101216817f02101216827f02101216837f02101216847f02101216857f02101216867f02101216877f021012167880021012167980021012167a80021012167b80021012167c80021012167d80021012167e80021012167f80021012168080021012168180021012168280021012168380021012168480021012168580021012168680021012168780021012167881021012167981021012167a81021012167b81021012167c81021012167d81021012167e81021012167f81021012168081021012168181021012168281021012168381021012168481021012168581021012168681021012168781021012167882021012167982021012167a82021012167b82021012167c82021012167d82021012167e82021012167f82021012168082021012168182021012168282021012168382021012168482021012168582021012168682021012168782021012167883021012167983021012167a83021012167b83021012167c83021012167d83021012167e83021012167f83021012168083021012168183021012168283021012168383021012168483021012168583021012168683021012168783021012167884021012167984021012167a84021012167b84021012167c84021012167d84021012167e84021012167f84021012168084021012168184021012168284021012168384021012168484021012168584021012168684021012168784021012167885021012167985021012167a85021012167b85021012167c85021012167d85021012167e85021012167f85021012168085021012168185021012168285021012168385021012168485021012168585021012168685021012168785021012167886021012167986021012167a86021012167b86021012167c86021012167d86021012167e86021012167f86021012168086021012168186021012168286021012168386021012168486021012168586021012168686021012168786021012167887021012167987021012167a87021012167b87021012167c87021012167d87021012167e87021012167f8702101216808702101216818702101216828702101216838702101216848702101216858702101216868702101216878702101216");

    function Mons$Object$qtd_mons_defeated$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $887 = self.cap;
                var $888 = (Number((list_length(Pair$snd$($887)))));
                var $886 = $888;
                break;
        };
        return $886;
    };
    const Mons$Object$qtd_mons_defeated = x0 => Mons$Object$qtd_mons_defeated$(x0);

    function Mons$draw$bag_select$(_mon_idx$1, _qtd$2, _scr$3) {
        var _def_y$4 = 42;
        var self = (_mon_idx$1 === 0);
        if (self) {
            var $890 = ((0 | 160 | (_def_y$4 << 12) | (0 << 24)));
            var _pos$5 = $890;
        } else {
            var $891 = ((0 | 160 | (((_def_y$4 + ((16 * _mon_idx$1) >>> 0)) >>> 0) << 12) | (0 << 24)));
            var _pos$5 = $891;
        };
        var self = (_qtd$2 === 0);
        if (self) {
            var $892 = _scr$3;
            var $889 = $892;
        } else {
            var _inventory_row_mon_selected$6 = Image3D$empty;
            var $893 = Mons$draw$image$(_inventory_row_mon_selected$6, _pos$5, _scr$3);
            var $889 = $893;
        };
        return $889;
    };
    const Mons$draw$bag_select = x0 => x1 => x2 => Mons$draw$bag_select$(x0, x1, x2);

    function Mons$draw$bag$(_obj$1, _idx$2, _scr$3) {
        var _inventory$4 = Mons$Assets$void;
        var _scr$5 = Mons$draw$image$(_inventory$4, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$3);
        var _scr$6 = Mons$draw$image$(Mons$draw$get_full_bg$(_idx$2), ((0 | 120 | (80 << 12) | (0 << 24))), _scr$5);
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $895 = self.bag;
                var $896 = self.mon;
                var $897 = self.bos;
                var $898 = self.cap;
                var _boss_def$18 = U32$to_string$((Number((list_length($897)))));
                var _qtd$19 = (Number((list_length($895))));
                var self = (_qtd$19 === 0);
                if (self) {
                    var $900 = "Nothing to show for now";
                    var _qtd_field$20 = $900;
                } else {
                    var _qtd_mons_game$20 = U32$to_string$(Pair$fst$($898));
                    var _qtd_defeated$21 = U32$to_string$(Mons$Object$qtd_mons_defeated$(_obj$1));
                    var $901 = String$flatten$(List$cons$("Captured: ", List$cons$(_qtd_defeated$21, List$cons$("/", List$cons$(_qtd_mons_game$20, List$nil)))));
                    var _qtd_field$20 = $901;
                };
                var _scr$21 = Mons$draw$text$(_qtd_field$20, Mons$Char_black$font, ((0 | 95 | (25 << 12) | (0 << 24))), _scr$6);
                var _scr$22 = Mons$draw$bag_select$($896, _qtd$19, _scr$21);
                var _scr$23 = Mons$draw$mon_img_selected$($896, _qtd$19, Bool$false, 34, ((0 | 40 | (50 << 12) | (0 << 24))), _scr$22);
                var _mons_names$24 = List$reverse$(Mons$Object$get_names$($895));
                var _mons_images$25 = List$reverse$(Mons$Object$get_images$($895));
                var _scr$26 = Mons$draw$list_image$(_mons_images$25, Bool$false, 34, ((0 | 40 | (50 << 12) | (0 << 24))), _scr$23);
                var _scr$27 = Mons$draw$list$(_mons_names$24, Bool$false, 14, Mons$Char_black$font, ((0 | 95 | (29 << 12) | (0 << 24))), _scr$26);
                var $899 = _scr$27;
                var $894 = $899;
                break;
        };
        return $894;
    };
    const Mons$draw$bag = x0 => x1 => x2 => Mons$draw$bag$(x0, x1, x2);

    function Mons$draw$full_bag$(_obj$1, _adve_obj$2, _idx$3, _scr$4) {
        var _inventory_mon_selection$5 = Image3D$empty;
        var _inventory_replace$6 = Image3D$empty;
        var _scr$7 = Mons$draw$image$(Mons$draw$get_full_bg$(_idx$3), ((0 | 120 | (80 << 12) | (0 << 24))), _scr$4);
        var _scr$8 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$7);
        var _scr$9 = Mons$draw$image$(_inventory_replace$6, ((0 | 65 | (60 << 12) | (0 << 24))), _scr$8);
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $903 = self.bag;
                var $904 = self.mon;
                var self = _adve_obj$2;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $906 = self.kin;
                        var self = Mons$Kind$attr$($906);
                        switch (self._) {
                            case 'Mons.Attr.new':
                                var $908 = self.pic;
                                var $909 = self.battle_spr;
                                var _scr$42 = Mons$draw$image$($909(Bool$false), ((0 | 180 | (40 << 12) | (0 << 24))), _scr$9);
                                var _scr$43 = Mons$draw$image$($908, ((0 | 180 | (90 << 12) | (0 << 24))), _scr$42);
                                var _scr$44 = Mons$draw$image$(_inventory_mon_selection$5, ((0 | 180 | (90 << 12) | (0 << 24))), _scr$43);
                                var _qtd$45 = (Number((list_length($903))));
                                var _mons_images$46 = List$reverse$(Mons$Object$get_images$($903));
                                var _scr$47 = Mons$draw$list_image$(_mons_images$46, Bool$true, 35, ((0 | 30 | (90 << 12) | (0 << 24))), _scr$44);
                                var _scr$48 = Mons$draw$mon_img_selected$($904, _qtd$45, Bool$true, 35, ((0 | 30 | (90 << 12) | (0 << 24))), _scr$47);
                                var _scr$49 = Mons$draw$text$("Select a mon to replace or skip", Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$48);
                                var _scr$50 = Mons$draw$text$("[c] Replace  | [z] Skip     ", Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$49);
                                var $910 = _scr$50;
                                var $907 = $910;
                                break;
                        };
                        var $905 = $907;
                        break;
                };
                var $902 = $905;
                break;
        };
        return $902;
    };
    const Mons$draw$full_bag = x0 => x1 => x2 => x3 => Mons$draw$full_bag$(x0, x1, x2, x3);

    function Mons$draw$(_game$1, _scr$2) {
        var self = _game$1;
        switch (self._) {
            case 'Mons.Game.new':
                var $912 = self.map;
                var $913 = self.stt;
                var _hero_pos$8 = Mons$Game$get_hero_pos$(_game$1);
                var _scr$9 = Image3D$clear$(_scr$2);
                var self = _hero_pos$8;
                switch (self._) {
                    case 'Maybe.some':
                        var $915 = self.value;
                        var _hero_pair$11 = Mons$Map$get_hero$($915, $912);
                        var _hero_obj$12 = Pair$fst$(_hero_pair$11);
                        var _hero_idx$13 = Pair$snd$(_hero_pair$11);
                        var _adve_obj$14 = Mons$Map$get$($915, ((_hero_idx$13 + 1) >>> 0), $912);
                        var _dim$15 = Mons$Game$dim$(_game$1);
                        var self = _hero_obj$12;
                        switch (self._) {
                            case 'Mons.Object.new':
                                var $917 = self.bos;
                                var $918 = self.cap;
                                var self = _adve_obj$14;
                                switch (self._) {
                                    case 'Mons.Object.new':
                                        var $920 = self.kin;
                                        var $921 = self.dmg;
                                        var $922 = self.eff;
                                        var _hero_mon_obj$38 = Mons$Object$get_current_mon$(_hero_obj$12);
                                        var self = _hero_mon_obj$38;
                                        switch (self._) {
                                            case 'Mons.Object.new':
                                                var $924 = self.kin;
                                                var $925 = self.dmg;
                                                var $926 = self.eff;
                                                var self = Mons$Kind$attr$($920);
                                                switch (self._) {
                                                    case 'Mons.Attr.new':
                                                        var $928 = self.mhp;
                                                        var $929 = self.name;
                                                        var $930 = self.battle_spr;
                                                        var _is_standing$60 = Mons$Object$is_standing$(_hero_obj$12);
                                                        var self = $913;
                                                        switch (self._) {
                                                            case 'Mons.Screen.welcome':
                                                                var $932 = self.idx;
                                                                var _logo$62 = Mons$Assets$char$boy_d_0;
                                                                var _scr$63 = Mons$draw$image$(_logo$62, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$9);
                                                                var _scr$64 = Mons$draw$image$(Mons$f_exe, ((0 | 80 | (80 << 12) | (0 << 24))), _scr$63);
                                                                var _scr$65 = Mons$draw$list$(List$cons$("Play", List$cons$("Credits", List$nil)), Bool$false, 25, Mons$Char_black$font, ((0 | 40 | (50 << 12) | (0 << 24))), _scr$64);
                                                                var _scr$66 = Mons$draw$list_selector$($932, Bool$false, 25, Mons$Char_black$font, ((0 | 30 | (50 << 12) | (0 << 24))), _scr$65);
                                                                var _scr$67 = Mons$draw$text$("[c] Select", Mons$Char_black$font, ((0 | 40 | (128 << 12) | (0 << 24))), _scr$66);
                                                                var $933 = _scr$67;
                                                                var $931 = $933;
                                                                break;
                                                            case 'Mons.Screen.introduction':
                                                                var $934 = self.step;
                                                                var self = (($929 === "MAGE") && _is_standing$60);
                                                                if (self) {
                                                                    var self = ($934 === 0);
                                                                    if (self) {
                                                                        var _game$62 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                        var $937 = Mons$draw$mage_talk$("Oh! So you really exist... the", "young man of the prophecy. [c]", _scr$9);
                                                                        var $936 = $937;
                                                                    } else {
                                                                        var self = ($934 === 1);
                                                                        if (self) {
                                                                            var _game$62 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                            var $939 = Mons$draw$mage_talk$("I\'m in a hurry and can\'t explain", "now, but... we depend on you. [c]", _scr$9);
                                                                            var $938 = $939;
                                                                        } else {
                                                                            var self = ($934 === 2);
                                                                            if (self) {
                                                                                var _game$62 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                var $941 = Mons$draw$mage_talk$("Great choice! You can press", "[e] to check it on the bag. [c]", _scr$9);
                                                                                var $940 = $941;
                                                                            } else {
                                                                                var $942 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                var $940 = $942;
                                                                            };
                                                                            var $938 = $940;
                                                                        };
                                                                        var $936 = $938;
                                                                    };
                                                                    var $935 = $936;
                                                                } else {
                                                                    var $943 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                    var $935 = $943;
                                                                };
                                                                var $931 = $935;
                                                                break;
                                                            case 'Mons.Screen.game':
                                                                var $944 = self.turn;
                                                                var _hero_mon_attr$63 = Mons$Kind$attr$($924);
                                                                var self = _hero_mon_attr$63;
                                                                switch (self._) {
                                                                    case 'Mons.Attr.new':
                                                                        var $946 = self.mhp;
                                                                        var $947 = self.name;
                                                                        var $948 = self.battle_spr;
                                                                        var self = $920;
                                                                        switch (self._) {
                                                                            case 'Mons.Kind.Mons':
                                                                                var $950 = self.ele;
                                                                                var $951 = self.boss;
                                                                                var _hero_chp$78 = (Math.max($946 - $925, 0));
                                                                                var _hero_btl_img$79 = $948(Bool$true);
                                                                                var _hero_txt$80 = String$flatten$(List$cons$($947, List$cons$(" ", List$cons$(Mons$draw$img_type$($924), List$nil))));
                                                                                var _hero_hp$81 = String$flatten$(List$cons$(Mons$draw$small_HP, List$cons$(" ", List$cons$(U32$to_string$(_hero_chp$78), List$cons$("/", List$cons$(U32$to_string$($946), List$nil))))));
                                                                                var _adve_chp$82 = (Math.max($928 - $921, 0));
                                                                                var _adve_btl_img$83 = $930(Bool$false);
                                                                                var _adve_txt$84 = String$flatten$(List$cons$($929, List$cons$(" ", List$cons$(Mons$draw$img_type$($920), List$nil))));
                                                                                var _adve_hp$85 = String$flatten$(List$cons$(Mons$draw$small_HP, List$cons$(" ", List$cons$(U32$to_string$(_adve_chp$82), List$cons$("/", List$cons$(U32$to_string$($928), List$nil))))));
                                                                                var self = _is_standing$60;
                                                                                if (self) {
                                                                                    var self = Mons$Object$is_battling$(_adve_obj$14, _hero_mon_obj$38);
                                                                                    if (self) {
                                                                                        var _scr$86 = Mons$draw$battle_bg$($950, $951, _dim$15, _scr$9);
                                                                                        var _scr$87 = Mons$draw$hero_hp$(_hero_chp$78, $946, _hero_txt$80, _hero_hp$81, _scr$86);
                                                                                        var _scr$88 = Mons$draw$adve_hp$(_adve_chp$82, $928, _adve_txt$84, _adve_hp$85, _scr$87);
                                                                                        var _scr$89 = Mons$draw$image$(_hero_btl_img$79, ((0 | 75 | (80 << 12) | (0 << 24))), _scr$88);
                                                                                        var _scr$90 = Mons$draw$image$(_adve_btl_img$83, ((0 | 180 | (40 << 12) | (0 << 24))), _scr$89);
                                                                                        var self = $944;
                                                                                        switch (self._) {
                                                                                            case 'Mons.Turn.new':
                                                                                                var $955 = self.hero_skill;
                                                                                                var $956 = self.adve_skill;
                                                                                                var _scr$95 = Mons$draw$effects$($926, $922, _scr$90);
                                                                                                var self = Mons$Turn$is_active$($944);
                                                                                                if (self) {
                                                                                                    var self = Mons$Turn$hero_turn$($944);
                                                                                                    if (self) {
                                                                                                        var $959 = Mons$draw$turn$($947, $955, _scr$95);
                                                                                                        var $958 = $959;
                                                                                                    } else {
                                                                                                        var $960 = Mons$draw$turn$($929, $956, _scr$95);
                                                                                                        var $958 = $960;
                                                                                                    };
                                                                                                    var $957 = $958;
                                                                                                } else {
                                                                                                    var $961 = Mons$draw$battle_skills$(_hero_mon_obj$38, _scr$95);
                                                                                                    var $957 = $961;
                                                                                                };
                                                                                                var $954 = $957;
                                                                                                break;
                                                                                        };
                                                                                        var $953 = $954;
                                                                                    } else {
                                                                                        var _scr$86 = Mons$draw$capture_bg$($950, _dim$15, _scr$9);
                                                                                        var self = Mons$Object$is_obj_defeated$(_adve_obj$14);
                                                                                        if (self) {
                                                                                            var self = $951;
                                                                                            if (self) {
                                                                                                var _scr$87 = Mons$draw$battle_win_bg$($950, _dim$15, _scr$86);
                                                                                                var _scr$88 = Mons$draw$text$("You unlocked the next level.", Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$87);
                                                                                                var _scr$89 = Mons$draw$text$("[c] I\'m ready!", Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$88);
                                                                                                var $964 = Mons$draw$image$(_adve_btl_img$83, ((0 | 180 | (40 << 12) | (0 << 24))), _scr$89);
                                                                                                var $963 = $964;
                                                                                            } else {
                                                                                                var _scr$87 = Mons$draw$battle_win_bg$($950, _dim$15, _scr$86);
                                                                                                var _scr$88 = Mons$draw$text$("[c] Capture", Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$87);
                                                                                                var _scr$89 = Mons$draw$text$("[z] Free", Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$88);
                                                                                                var $965 = Mons$draw$image$(_adve_btl_img$83, ((0 | 180 | (40 << 12) | (0 << 24))), _scr$89);
                                                                                                var $963 = $965;
                                                                                            };
                                                                                            var _scr$87 = $963;
                                                                                        } else {
                                                                                            var self = Mons$Object$is_obj_defeated$(_hero_mon_obj$38);
                                                                                            if (self) {
                                                                                                var _scr$87 = Mons$draw$text$("You lost the battle and your Mon.", Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$86);
                                                                                                var _scr$88 = Mons$draw$text$("[c] I\'ll do better next time", Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$87);
                                                                                                var $967 = Mons$draw$image$(_hero_btl_img$79, ((0 | 75 | (80 << 12) | (0 << 24))), _scr$88);
                                                                                                var $966 = $967;
                                                                                            } else {
                                                                                                var $968 = _scr$86;
                                                                                                var $966 = $968;
                                                                                            };
                                                                                            var _scr$87 = $966;
                                                                                        };
                                                                                        var $962 = _scr$87;
                                                                                        var $953 = $962;
                                                                                    };
                                                                                    var $952 = $953;
                                                                                } else {
                                                                                    var $969 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                    var $952 = $969;
                                                                                };
                                                                                var $949 = $952;
                                                                                break;
                                                                            case 'Mons.Kind.Interactive':
                                                                                var $970 = self.ele;
                                                                                var $971 = self.on;
                                                                                var self = $970;
                                                                                switch (self._) {
                                                                                    case 'Mons.Kind.inter.LEVER':
                                                                                    case 'Mons.Kind.inter.MOVE':
                                                                                        var $973 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                        var $972 = $973;
                                                                                        break;
                                                                                    case 'Mons.Kind.inter.HEAL':
                                                                                        var self = $971;
                                                                                        if (self) {
                                                                                            var _scr$77 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                            var _scr$78 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$77);
                                                                                            var $975 = Mons$draw$text$("You already used the heal.", Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$78);
                                                                                            var $974 = $975;
                                                                                        } else {
                                                                                            var _scr$77 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                            var _scr$78 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$77);
                                                                                            var _scr$79 = Mons$draw$text$("Press [c] to heal 15HP on all of", Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$78);
                                                                                            var $976 = Mons$draw$text$("your Mons", Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$79);
                                                                                            var $974 = $976;
                                                                                        };
                                                                                        var $972 = $974;
                                                                                        break;
                                                                                };
                                                                                var $949 = $972;
                                                                                break;
                                                                            case 'Mons.Kind.Const':
                                                                                var self = (_is_standing$60 && Mons$Kind$is_portal$($920));
                                                                                if (self) {
                                                                                    var _game$75 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                    var self = (Mons$Game$defeated_lvl_mons$(Pair$fst$($918), _dim$15) || ((Number((list_length($917)))) === ((_dim$15 / 2) >>> 0)));
                                                                                    if (self) {
                                                                                        var _scr$76 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$9);
                                                                                        var $979 = Mons$draw$text$("Press [c] to access next level", Mons$Char_black$font, ((0 | 30 | (135 << 12) | (0 << 24))), _scr$76);
                                                                                        var $978 = $979;
                                                                                    } else {
                                                                                        var _scr$76 = Mons$draw$image$(Mons$draw$text_screen_bg, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$9);
                                                                                        var _scr$77 = Mons$draw$text$("To access the next level you must", Mons$Char_black$font, Mons$draw$msg_screen$line_0, _scr$76);
                                                                                        var $980 = Mons$draw$text$("first defeat all enemies.", Mons$Char_black$font, Mons$draw$msg_screen$line_1, _scr$77);
                                                                                        var $978 = $980;
                                                                                    };
                                                                                    var $977 = $978;
                                                                                } else {
                                                                                    var $981 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                    var $977 = $981;
                                                                                };
                                                                                var $949 = $977;
                                                                                break;
                                                                            case 'Mons.Kind.Terrain':
                                                                                var $982 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                                var $949 = $982;
                                                                                break;
                                                                        };
                                                                        var $945 = $949;
                                                                        break;
                                                                };
                                                                var $931 = $945;
                                                                break;
                                                            case 'Mons.Screen.capture_mon':
                                                                var $983 = self.full_bag;
                                                                var self = $983;
                                                                if (self) {
                                                                    var $985 = Mons$draw$full_bag$(_hero_obj$12, _adve_obj$14, _dim$15, _scr$9);
                                                                    var $984 = $985;
                                                                } else {
                                                                    var $986 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                    var $984 = $986;
                                                                };
                                                                var $931 = $984;
                                                                break;
                                                            case 'Mons.Screen.credits':
                                                                var _battle_normal_bg_full$61 = Image3D$empty;
                                                                var _scr$62 = Mons$draw$image$(_battle_normal_bg_full$61, ((0 | 120 | (80 << 12) | (0 << 24))), _scr$9);
                                                                var _artists0$63 = List$cons$("Alexandre Avila", List$cons$("Caio Carvalho", List$cons$("Johnny Azevedo", List$cons$("Lucca Tuelher", List$cons$("Maisa Milena", List$cons$("Marcio Maia", List$cons$("Marcos Medeiros", List$nil)))))));
                                                                var _artists1$64 = List$cons$("Marcos Motta", List$cons$("Nathan Danjo", List$cons$("Paulo Reis", List$cons$("Pedro Taka", List$cons$("Rodrigo Rodrigues", List$cons$("Victor Maia", List$cons$("Yuri Carvalho", List$nil)))))));
                                                                var _scr$65 = Mons$draw$text$("[z] Back", Mons$Char_white$font, ((0 | 20 | (15 << 12) | (0 << 24))), _scr$62);
                                                                var _scr$66 = Mons$draw$list$(_artists0$63, Bool$false, 15, Mons$Char_white$font, ((0 | 20 | (20 << 12) | (0 << 24))), _scr$65);
                                                                var _scr$67 = Mons$draw$list$(_artists1$64, Bool$false, 15, Mons$Char_white$font, ((0 | 125 | (20 << 12) | (0 << 24))), _scr$66);
                                                                var $987 = _scr$67;
                                                                var $931 = $987;
                                                                break;
                                                            case 'Mons.Screen.intro_select':
                                                                var _game$62 = Mons$Map$build_sprites$(_game$1, _scr$9, $915, _hero_obj$12);
                                                                var $988 = Mons$draw$initial_mons$(_hero_obj$12, _scr$9);
                                                                var $931 = $988;
                                                                break;
                                                            case 'Mons.Screen.inventory':
                                                                var $989 = Mons$draw$bag$(_hero_obj$12, _dim$15, _scr$9);
                                                                var $931 = $989;
                                                                break;
                                                            case 'Mons.Screen.game_over':
                                                                var $990 = Mons$draw$text$("GAME OVER", Mons$Char_white$font, ((0 | 90 | (80 << 12) | (0 << 24))), _scr$9);
                                                                var $931 = $990;
                                                                break;
                                                        };
                                                        var $927 = $931;
                                                        break;
                                                };
                                                var $923 = $927;
                                                break;
                                        };
                                        var $919 = $923;
                                        break;
                                };
                                var $916 = $919;
                                break;
                        };
                        var $914 = $916;
                        break;
                    case 'Maybe.none':
                        var $991 = _scr$9;
                        var $914 = $991;
                        break;
                };
                var $911 = $914;
                break;
        };
        return $911;
    };
    const Mons$draw = x0 => x1 => Mons$draw$(x0, x1);

    function App$Action$(_S$1) {
        var $992 = null;
        return $992;
    };
    const App$Action = x0 => App$Action$(x0);

    function App$Action$print$(_text$2) {
        var $993 = ({
            _: 'App.Action.print',
            'text': _text$2
        });
        return $993;
    };
    const App$Action$print = x0 => App$Action$print$(x0);

    function App$Action$resize$(_width$2, _height$3) {
        var $994 = ({
            _: 'App.Action.resize',
            'width': _width$2,
            'height': _height$3
        });
        return $994;
    };
    const App$Action$resize = x0 => x1 => App$Action$resize$(x0, x1);
    const Mons$scr_w = ((((Mons$scr_mid & 0xFFF)) * 2) >>> 0);
    const Mons$scr_h = (((((Mons$scr_mid >>> 12) & 0xFFF)) * 2) >>> 0);

    function App$Action$state$(_value$2) {
        var $995 = ({
            _: 'App.Action.state',
            'value': _value$2
        });
        return $995;
    };
    const App$Action$state = x0 => App$Action$state$(x0);

    function Mons$Game$set_usr$(_usr$1, _game$2) {
        var self = _game$2;
        switch (self._) {
            case 'Mons.Game.new':
                var $997 = self.pos;
                var $998 = self.map;
                var $999 = self.stt;
                var $1000 = self.tik;
                var $1001 = Mons$Game$new$(_usr$1, $997, $998, $999, $1000);
                var $996 = $1001;
                break;
        };
        return $996;
    };
    const Mons$Game$set_usr = x0 => x1 => Mons$Game$set_usr$(x0, x1);

    function App$Action$watch$(_room$2) {
        var $1002 = ({
            _: 'App.Action.watch',
            'room': _room$2
        });
        return $1002;
    };
    const App$Action$watch = x0 => App$Action$watch$(x0);

    function Word$from_bits$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $1004 = Word$e;
            var $1003 = $1004;
        } else {
            var $1005 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $1007 = self.slice(0, -1);
                    var $1008 = Word$o$(Word$from_bits$($1005, $1007));
                    var $1006 = $1008;
                    break;
                case 'i':
                    var $1009 = self.slice(0, -1);
                    var $1010 = Word$i$(Word$from_bits$($1005, $1009));
                    var $1006 = $1010;
                    break;
                case 'e':
                    var $1011 = Word$o$(Word$from_bits$($1005, Bits$e));
                    var $1006 = $1011;
                    break;
            };
            var $1003 = $1006;
        };
        return $1003;
    };
    const Word$from_bits = x0 => x1 => Word$from_bits$(x0, x1);
    const Bits$concat = a0 => a1 => (a1 + a0);

    function String$to_bits$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $1013 = Bits$e;
            var $1012 = $1013;
        } else {
            var $1014 = self.charCodeAt(0);
            var $1015 = self.slice(1);
            var $1016 = (String$to_bits$($1015) + (u16_to_bits($1014)));
            var $1012 = $1016;
        };
        return $1012;
    };
    const String$to_bits = x0 => String$to_bits$(x0);
    const Mons$App$room = Word$from_bits$(48n, String$to_bits$("MON"));

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $1018 = Bool$false;
                var $1017 = $1018;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $1019 = Bool$true;
                var $1017 = $1019;
                break;
        };
        return $1017;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $1020 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $1020;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);
    const U16$gte = a0 => a1 => (a0 >= a1);
    const U16$lte = a0 => a1 => (a0 <= a1);
    const U16$sub = a0 => a1 => (Math.max(a0 - a1, 0));

    function Char$to_upper$(_char$1) {
        var self = ((_char$1 >= 97) && (_char$1 <= 122));
        if (self) {
            var $1022 = (Math.max(_char$1 - 32, 0));
            var $1021 = $1022;
        } else {
            var $1023 = _char$1;
            var $1021 = $1023;
        };
        return $1021;
    };
    const Char$to_upper = x0 => Char$to_upper$(x0);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Char$to_lower$(_char$1) {
        var self = ((_char$1 >= 65) && (_char$1 <= 90));
        if (self) {
            var $1025 = ((_char$1 + 32) & 0xFFFF);
            var $1024 = $1025;
        } else {
            var $1026 = _char$1;
            var $1024 = $1026;
        };
        return $1024;
    };
    const Char$to_lower = x0 => Char$to_lower$(x0);

    function Mons$Input$char$(_down$1, _code$2) {
        var self = _down$1;
        if (self) {
            var $1028 = Char$to_upper$(_code$2);
            var $1027 = $1028;
        } else {
            var $1029 = Char$to_lower$(_code$2);
            var $1027 = $1029;
        };
        return $1027;
    };
    const Mons$Input$char = x0 => x1 => Mons$Input$char$(x0, x1);
    const Mons$Input$list = (() => {
        var _b0$1 = Bits$o;
        var _b1$2 = Bits$i;
        var _bn$3 = Bits$e;
        var $1030 = List$cons$(Pair$new$(68, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(87, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(65, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(83, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(85, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(73, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(74, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(75, _b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(100, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(119, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(97, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b1$2(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(115, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b1$2(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(117, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b0$1(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(105, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b0$1(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(106, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b1$2(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(107, _b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b1$2(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(101, _b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_b0$1(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(69, _b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_b0$1(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(99, _b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_b1$2(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(67, _b0$1(_b0$1(_b0$1(_b1$2(_b0$1(_b1$2(_b1$2(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(122, _b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b1$2(_b1$2(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(90, _b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_b0$1(_b0$1(_b0$1(_bn$3))))))))), List$cons$(Pair$new$(82, _b0$1(_b0$1(_b1$2(_b0$1(_b0$1(_b0$1(_b0$1(_b1$2(_bn$3))))))))), List$cons$(Pair$new$(114, _b0$1(_b0$1(_b0$1(_b1$2(_b1$2(_b1$2(_b1$2(_b1$2(_bn$3))))))))), List$nil))))))))))))))))))))))));
        return $1030;
    })();
    const Mons$Input$char_to_code_map = (() => {
        var _map$1 = Map$new;
        var _map$2 = (() => {
            var $1033 = _map$1;
            var $1034 = Mons$Input$list;
            let _map$3 = $1033;
            let _char_code$2;
            while ($1034._ === 'List.cons') {
                _char_code$2 = $1034.head;
                var self = _char_code$2;
                switch (self._) {
                    case 'Pair.new':
                        var $1035 = self.fst;
                        var $1036 = self.snd;
                        var $1037 = Map$set$((u16_to_bits($1035)), $1036, _map$3);
                        var $1033 = $1037;
                        break;
                };
                _map$3 = $1033;
                $1034 = $1034.tail;
            }
            return _map$3;
        })();
        var $1031 = _map$2;
        return $1031;
    })();

    function Mons$Input$serialize$(_char$1) {
        var self = Map$get$((u16_to_bits(_char$1)), Mons$Input$char_to_code_map);
        switch (self._) {
            case 'Maybe.some':
                var $1039 = self.value;
                var $1040 = Maybe$some$(Word$from_bits$(256n, $1039));
                var $1038 = $1040;
                break;
            case 'Maybe.none':
                var $1041 = Maybe$none;
                var $1038 = $1041;
                break;
        };
        return $1038;
    };
    const Mons$Input$serialize = x0 => Mons$Input$serialize$(x0);

    function App$Action$post$(_room$2, _data$3) {
        var $1042 = ({
            _: 'App.Action.post',
            'room': _room$2,
            'data': _data$3
        });
        return $1042;
    };
    const App$Action$post = x0 => x1 => App$Action$post$(x0, x1);

    function Mons$Object$set_ani$(_obj$1, _ani$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1044 = self.kin;
                var $1045 = self.dir;
                var $1046 = self.pad;
                var $1047 = self.dmg;
                var $1048 = self.bag;
                var $1049 = self.mon;
                var $1050 = self.bos;
                var $1051 = self.cap;
                var $1052 = self.idl;
                var $1053 = self.eff;
                var $1054 = Mons$Object$new$($1044, $1045, $1046, _ani$2, $1047, $1048, $1049, $1050, $1051, $1052, $1053);
                var $1043 = $1054;
                break;
        };
        return $1043;
    };
    const Mons$Object$set_ani = x0 => x1 => Mons$Object$set_ani$(x0, x1);

    function Mons$Object$set_dir$(_obj$1, _dir$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1056 = self.kin;
                var $1057 = self.pad;
                var $1058 = self.ani;
                var $1059 = self.dmg;
                var $1060 = self.bag;
                var $1061 = self.mon;
                var $1062 = self.bos;
                var $1063 = self.cap;
                var $1064 = self.idl;
                var $1065 = self.eff;
                var $1066 = Mons$Object$new$($1056, _dir$2, $1057, $1058, $1059, $1060, $1061, $1062, $1063, $1064, $1065);
                var $1055 = $1066;
                break;
        };
        return $1055;
    };
    const Mons$Object$set_dir = x0 => x1 => Mons$Object$set_dir$(x0, x1);

    function Mons$Object$is_free_to_move$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1068 = self.ani;
                var $1069 = ($1068 === 0);
                var $1067 = $1069;
                break;
        };
        return $1067;
    };
    const Mons$Object$is_free_to_move = x0 => Mons$Object$is_free_to_move$(x0);
    const Mons$Dir$up = ({
        _: 'Mons.Dir.up'
    });
    const Mons$Dir$left = ({
        _: 'Mons.Dir.left'
    });
    const Mons$Dir$right = ({
        _: 'Mons.Dir.right'
    });

    function Mons$Object$tick$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1071 = self.dir;
                var $1072 = self.pad;
                var $1073 = self.ani;
                var _obj$13 = Mons$Object$set_ani$(_obj$1, (() => {
                    var self = ($1073 > 0);
                    if (self) {
                        var $1075 = (Math.max($1073 - 2, 0));
                        return $1075;
                    } else {
                        var $1076 = $1073;
                        return $1076;
                    };
                })());
                var _obj$14 = Mons$Object$set_dir$(_obj$13, (() => {
                    var self = Mons$Object$is_free_to_move$(_obj$13);
                    if (self) {
                        var self = $1072;
                        switch (self._) {
                            case 'Mons.Pad.new':
                                var $1078 = self.r;
                                var $1079 = self.u;
                                var $1080 = self.l;
                                var $1081 = self.d;
                                var self = $1079;
                                if (self) {
                                    var $1083 = Mons$Dir$up;
                                    var $1082 = $1083;
                                } else {
                                    var self = $1080;
                                    if (self) {
                                        var $1085 = Mons$Dir$left;
                                        var $1084 = $1085;
                                    } else {
                                        var self = $1081;
                                        if (self) {
                                            var $1087 = Mons$Dir$down;
                                            var $1086 = $1087;
                                        } else {
                                            var self = $1078;
                                            if (self) {
                                                var $1089 = Mons$Dir$right;
                                                var $1088 = $1089;
                                            } else {
                                                var $1090 = $1071;
                                                var $1088 = $1090;
                                            };
                                            var $1086 = $1088;
                                        };
                                        var $1084 = $1086;
                                    };
                                    var $1082 = $1084;
                                };
                                var $1077 = $1082;
                                break;
                        };
                        return $1077;
                    } else {
                        var $1091 = $1071;
                        return $1091;
                    };
                })());
                var $1074 = _obj$14;
                var $1070 = $1074;
                break;
        };
        return $1070;
    };
    const Mons$Object$tick = x0 => Mons$Object$tick$(x0);

    function Mons$Dir$move$(_dir$1, _pos$2) {
        var self = _dir$1;
        switch (self._) {
            case 'Mons.Dir.right':
                var $1093 = Pos32$add$(_pos$2, ((0 | 1 | (0 << 12) | (0 << 24))));
                var $1092 = $1093;
                break;
            case 'Mons.Dir.up':
                var $1094 = Pos32$sub$(_pos$2, ((0 | 0 | (1 << 12) | (0 << 24))));
                var $1092 = $1094;
                break;
            case 'Mons.Dir.left':
                var $1095 = Pos32$sub$(_pos$2, ((0 | 1 | (0 << 12) | (0 << 24))));
                var $1092 = $1095;
                break;
            case 'Mons.Dir.down':
                var $1096 = Pos32$add$(_pos$2, ((0 | 0 | (1 << 12) | (0 << 24))));
                var $1092 = $1096;
                break;
        };
        return $1092;
    };
    const Mons$Dir$move = x0 => x1 => Mons$Dir$move$(x0, x1);

    function Mons$Map$pop$(_pos$1, _map$2) {
        var _objs$3 = Mons$Map$get_list$(_pos$1, _map$2);
        var self = _objs$3;
        switch (self._) {
            case 'List.cons':
                var $1098 = self.head;
                var $1099 = self.tail;
                var _map$6 = Mons$Map$set_list$(_pos$1, $1099, _map$2);
                var $1100 = Pair$new$(_map$6, $1098);
                var $1097 = $1100;
                break;
            case 'List.nil':
                var $1101 = Pair$new$(_map$2, Mons$Object$void);
                var $1097 = $1101;
                break;
        };
        return $1097;
    };
    const Mons$Map$pop = x0 => x1 => Mons$Map$pop$(x0, x1);

    function Mons$Map$get_top$(_pos$1, _map$2) {
        var $1102 = Pair$snd$(Mons$Map$pop$(_pos$1, _map$2));
        return $1102;
    };
    const Mons$Map$get_top = x0 => x1 => Mons$Map$get_top$(x0, x1);

    function Mons$Object$is_walking$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1104 = self.pad;
                var self = $1104;
                switch (self._) {
                    case 'Mons.Pad.new':
                        var $1106 = self.r;
                        var $1107 = self.u;
                        var $1108 = self.l;
                        var $1109 = self.d;
                        var _is_walking_x$17 = ($1107 || $1109);
                        var _is_walking_y$18 = ($1108 || $1106);
                        var $1110 = (_is_walking_x$17 || _is_walking_y$18);
                        var $1105 = $1110;
                        break;
                };
                var $1103 = $1105;
                break;
        };
        return $1103;
    };
    const Mons$Object$is_walking = x0 => Mons$Object$is_walking$(x0);

    function Mons$Kind$get_blocks$(_kind$1) {
        var self = Mons$Kind$attr$(_kind$1);
        switch (self._) {
            case 'Mons.Attr.new':
                var $1112 = self.blocks;
                var $1113 = $1112;
                var $1111 = $1113;
                break;
        };
        return $1111;
    };
    const Mons$Kind$get_blocks = x0 => Mons$Kind$get_blocks$(x0);

    function Mons$Game$move_obj$(_from$1, _idx$2, _to$3, _obj$4, _game$5) {
        var _game$6 = Mons$Game$map_del$(_from$1, _idx$2, _game$5);
        var _game$7 = Mons$Game$map_push$(_to$3, _obj$4, _game$6);
        var $1114 = _game$7;
        return $1114;
    };
    const Mons$Game$move_obj = x0 => x1 => x2 => x3 => x4 => Mons$Game$move_obj$(x0, x1, x2, x3, x4);

    function Mons$Game$set_user_pos$(_user$1, _pos$2, _game$3) {
        var self = _game$3;
        switch (self._) {
            case 'Mons.Game.new':
                var $1116 = self.usr;
                var $1117 = self.pos;
                var $1118 = self.map;
                var $1119 = self.stt;
                var $1120 = self.tik;
                var $1121 = Mons$Game$new$($1116, Map$set$(Word$to_bits$(_user$1), _pos$2, $1117), $1118, $1119, $1120);
                var $1115 = $1121;
                break;
        };
        return $1115;
    };
    const Mons$Game$set_user_pos = x0 => x1 => x2 => Mons$Game$set_user_pos$(x0, x1, x2);

    function Mons$Game$tick_user$(_user$1, _pos$2, _game$3) {
        var self = _game$3;
        switch (self._) {
            case 'Mons.Game.new':
                var $1123 = self.map;
                var _map$9 = $1123;
                var _obj_idx$10 = Mons$Map$get_hero$(_pos$2, _map$9);
                var _obj$11 = Pair$fst$(_obj_idx$10);
                var _idx$12 = Pair$snd$(_obj_idx$10);
                var _obj$13 = Mons$Object$tick$(_obj$11);
                var self = _obj$13;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1125 = self.dir;
                        var _old_pos$25 = _pos$2;
                        var _new_pos$26 = Mons$Dir$move$($1125, _pos$2);
                        var _trg$27 = Mons$Map$get_top$(_new_pos$26, _map$9);
                        var self = _trg$27;
                        switch (self._) {
                            case 'Mons.Object.new':
                                var $1127 = self.kin;
                                var _is_walking$39 = Mons$Object$is_walking$(_obj$13);
                                var _is_movfree$40 = Mons$Object$is_free_to_move$(_obj$13);
                                var _is_blocked$41 = Mons$Kind$get_blocks$($1127);
                                var self = (_is_walking$39 && (_is_movfree$40 && (!_is_blocked$41)));
                                if (self) {
                                    var _obj$42 = Mons$Object$set_ani$(_obj$13, 16);
                                    var _game$43 = Mons$Game$move_obj$(_old_pos$25, _idx$12, _new_pos$26, _obj$42, _game$3);
                                    var _game$44 = Mons$Game$set_user_pos$(_user$1, _new_pos$26, _game$43);
                                    var $1129 = _game$44;
                                    var $1128 = $1129;
                                } else {
                                    var $1130 = Mons$Game$map_set$(_pos$2, _idx$12, _obj$13, _game$3);
                                    var $1128 = $1130;
                                };
                                var $1126 = $1128;
                                break;
                        };
                        var $1124 = $1126;
                        break;
                };
                var $1122 = $1124;
                break;
        };
        return $1122;
    };
    const Mons$Game$tick_user = x0 => x1 => x2 => Mons$Game$tick_user$(x0, x1, x2);

    function Mons$Game$set_tik$(_tik$1, _game$2) {
        var self = _game$2;
        switch (self._) {
            case 'Mons.Game.new':
                var $1132 = self.usr;
                var $1133 = self.pos;
                var $1134 = self.map;
                var $1135 = self.stt;
                var $1136 = Mons$Game$new$($1132, $1133, $1134, $1135, _tik$1);
                var $1131 = $1136;
                break;
        };
        return $1131;
    };
    const Mons$Game$set_tik = x0 => x1 => Mons$Game$set_tik$(x0, x1);

    function Mons$Game$tick_game$(_game$1) {
        var self = _game$1;
        switch (self._) {
            case 'Mons.Game.new':
                var $1138 = self.tik;
                var $1139 = Mons$Game$set_tik$((($1138 + 1) >>> 0), _game$1);
                var $1137 = $1139;
                break;
        };
        return $1137;
    };
    const Mons$Game$tick_game = x0 => Mons$Game$tick_game$(x0);

    function Mons$Game$tick$(_game$1, _time$2) {
        var self = _game$1;
        switch (self._) {
            case 'Mons.Game.new':
                var $1141 = self.usr;
                var self = Mons$Game$get_user_pos$($1141, _game$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $1143 = self.value;
                        var $1144 = $1143;
                        var _pos$8 = $1144;
                        break;
                    case 'Maybe.none':
                        var $1145 = Mons$scr_mid;
                        var _pos$8 = $1145;
                        break;
                };
                var _game$9 = Mons$Game$tick_user$($1141, _pos$8, _game$1);
                var _game$10 = Mons$Game$tick_game$(_game$9);
                var $1142 = _game$10;
                var $1140 = $1142;
                break;
        };
        return $1140;
    };
    const Mons$Game$tick = x0 => x1 => Mons$Game$tick$(x0, x1);

    function Bits$slice$(_len$1, _bits$2) {
        var self = _len$1;
        if (self === 0n) {
            var $1147 = Bits$e;
            var $1146 = $1147;
        } else {
            var $1148 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $1150 = self.slice(0, -1);
                    var $1151 = (Bits$slice$($1148, $1150) + '0');
                    var $1149 = $1151;
                    break;
                case 'i':
                    var $1152 = self.slice(0, -1);
                    var $1153 = (Bits$slice$($1148, $1152) + '1');
                    var $1149 = $1153;
                    break;
                case 'e':
                    var $1154 = Bits$e;
                    var $1149 = $1154;
                    break;
            };
            var $1146 = $1149;
        };
        return $1146;
    };
    const Bits$slice = x0 => x1 => Bits$slice$(x0, x1);
    const Mons$Input$code_to_char_map = (() => {
        var _map$1 = Map$new;
        var _map$2 = (() => {
            var $1157 = _map$1;
            var $1158 = Mons$Input$list;
            let _map$3 = $1157;
            let _char_code$2;
            while ($1158._ === 'List.cons') {
                _char_code$2 = $1158.head;
                var self = _char_code$2;
                switch (self._) {
                    case 'Pair.new':
                        var $1159 = self.fst;
                        var $1160 = self.snd;
                        var $1161 = Map$set$($1160, $1159, _map$3);
                        var $1157 = $1161;
                        break;
                };
                _map$3 = $1157;
                $1158 = $1158.tail;
            }
            return _map$3;
        })();
        var $1155 = _map$2;
        return $1155;
    })();

    function Mons$Input$deserialize$(_code$1) {
        var $1162 = Map$get$(Bits$slice$(8n, Word$to_bits$(_code$1)), Mons$Input$code_to_char_map);
        return $1162;
    };
    const Mons$Input$deserialize = x0 => Mons$Input$deserialize$(x0);

    function Mons$Game$set_stt$(_stt$1, _game$2) {
        var self = _game$2;
        switch (self._) {
            case 'Mons.Game.new':
                var $1164 = self.usr;
                var $1165 = self.pos;
                var $1166 = self.map;
                var $1167 = self.tik;
                var $1168 = Mons$Game$new$($1164, $1165, $1166, _stt$1, $1167);
                var $1163 = $1168;
                break;
        };
        return $1163;
    };
    const Mons$Game$set_stt = x0 => x1 => Mons$Game$set_stt$(x0, x1);
    const Mons$Kind$mons$HERO = ({
        _: 'Mons.Kind.mons.HERO'
    });
    const Mons$Type$fire = ({
        _: 'Mons.Type.fire'
    });
    const Mons$Object$hero = Mons$Object$new_of_kind$(Mons$Kind$Mons$(Mons$Kind$mons$HERO, Bool$false, Mons$Type$fire, 1));

    function Mons$Object$ended_battle$(_adve$1, _hero$2) {
        var self = _adve$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1170 = self.kin;
                var self = _hero$2;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1172 = self.kin;
                        var self = $1170;
                        switch (self._) {
                            case 'Mons.Kind.Mons':
                                var _adve_kin$29 = Mons$Kind$attr$($1170);
                                var _hero_kin$30 = Mons$Kind$attr$($1172);
                                var self = _adve_kin$29;
                                switch (self._) {
                                    case 'Mons.Attr.new':
                                        var self = _hero_kin$30;
                                        switch (self._) {
                                            case 'Mons.Attr.new':
                                                var _adve_status$51 = Mons$Object$is_obj_defeated$(_adve$1);
                                                var _hero_status$52 = Mons$Object$is_obj_defeated$(_hero$2);
                                                var $1176 = (_adve_status$51 || _hero_status$52);
                                                var $1175 = $1176;
                                                break;
                                        };
                                        var $1174 = $1175;
                                        break;
                                };
                                var $1173 = $1174;
                                break;
                            case 'Mons.Kind.Const':
                            case 'Mons.Kind.Terrain':
                            case 'Mons.Kind.Interactive':
                                var $1177 = Bool$false;
                                var $1173 = $1177;
                                break;
                        };
                        var $1171 = $1173;
                        break;
                };
                var $1169 = $1171;
                break;
        };
        return $1169;
    };
    const Mons$Object$ended_battle = x0 => x1 => Mons$Object$ended_battle$(x0, x1);

    function Mons$Screen$introduction$(_step$1) {
        var $1178 = ({
            _: 'Mons.Screen.introduction',
            'step': _step$1
        });
        return $1178;
    };
    const Mons$Screen$introduction = x0 => Mons$Screen$introduction$(x0);
    const Mons$Screen$credits = ({
        _: 'Mons.Screen.credits'
    });

    function Mons$Screen$welcome$(_idx$1) {
        var $1179 = ({
            _: 'Mons.Screen.welcome',
            'idx': _idx$1
        });
        return $1179;
    };
    const Mons$Screen$welcome = x0 => Mons$Screen$welcome$(x0);

    function List$elem$(_p$2, _a$3, _as$4) {
        var List$elem$ = (_p$2, _a$3, _as$4) => ({
            ctr: 'TCO',
            arg: [_p$2, _a$3, _as$4]
        });
        var List$elem = _p$2 => _a$3 => _as$4 => List$elem$(_p$2, _a$3, _as$4);
        var arg = [_p$2, _a$3, _as$4];
        while (true) {
            let [_p$2, _a$3, _as$4] = arg;
            var R = (() => {
                var self = _as$4;
                switch (self._) {
                    case 'List.cons':
                        var $1180 = self.head;
                        var $1181 = self.tail;
                        var self = _p$2(_a$3)($1180);
                        if (self) {
                            var $1183 = Bool$true;
                            var $1182 = $1183;
                        } else {
                            var $1184 = List$elem$(_p$2, _a$3, $1181);
                            var $1182 = $1184;
                        };
                        return $1182;
                    case 'List.nil':
                        var $1185 = Bool$false;
                        return $1185;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$elem = x0 => x1 => x2 => List$elem$(x0, x1, x2);

    function Char$eql$(_a$1, _b$2) {
        var $1186 = (_a$1 === _b$2);
        return $1186;
    };
    const Char$eql = x0 => x1 => Char$eql$(x0, x1);

    function Mons$is_walk_cmd$(_cmd$1) {
        var $1187 = List$elem$(Char$eql, _cmd$1, List$cons$(87, List$cons$(65, List$cons$(83, List$cons$(68, List$cons$(119, List$cons$(97, List$cons$(115, List$cons$(100, List$nil)))))))));
        return $1187;
    };
    const Mons$is_walk_cmd = x0 => Mons$is_walk_cmd$(x0);

    function Mons$key_to_dir$(_key_code$1) {
        var self = ((_key_code$1 === 65) || (_key_code$1 === 97));
        if (self) {
            var $1189 = Maybe$some$(Mons$Dir$left);
            var $1188 = $1189;
        } else {
            var self = ((_key_code$1 === 68) || (_key_code$1 === 100));
            if (self) {
                var $1191 = Maybe$some$(Mons$Dir$right);
                var $1190 = $1191;
            } else {
                var self = ((_key_code$1 === 87) || (_key_code$1 === 119));
                if (self) {
                    var $1193 = Maybe$some$(Mons$Dir$up);
                    var $1192 = $1193;
                } else {
                    var self = ((_key_code$1 === 83) || (_key_code$1 === 115));
                    if (self) {
                        var $1195 = Maybe$some$(Mons$Dir$down);
                        var $1194 = $1195;
                    } else {
                        var $1196 = Maybe$none;
                        var $1194 = $1196;
                    };
                    var $1192 = $1194;
                };
                var $1190 = $1192;
            };
            var $1188 = $1190;
        };
        return $1188;
    };
    const Mons$key_to_dir = x0 => Mons$key_to_dir$(x0);

    function Mons$Object$set_pad$(_obj$1, _pad$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1198 = self.kin;
                var $1199 = self.dir;
                var $1200 = self.ani;
                var $1201 = self.dmg;
                var $1202 = self.bag;
                var $1203 = self.mon;
                var $1204 = self.bos;
                var $1205 = self.cap;
                var $1206 = self.idl;
                var $1207 = self.eff;
                var $1208 = Mons$Object$new$($1198, $1199, _pad$2, $1200, $1201, $1202, $1203, $1204, $1205, $1206, $1207);
                var $1197 = $1208;
                break;
        };
        return $1197;
    };
    const Mons$Object$set_pad = x0 => x1 => Mons$Object$set_pad$(x0, x1);

    function Mons$Pad$set_r$(_pad$1, _val$2) {
        var self = _pad$1;
        switch (self._) {
            case 'Mons.Pad.new':
                var $1210 = self.u;
                var $1211 = self.l;
                var $1212 = self.d;
                var $1213 = Mons$Pad$new$(_val$2, $1210, $1211, $1212);
                var $1209 = $1213;
                break;
        };
        return $1209;
    };
    const Mons$Pad$set_r = x0 => x1 => Mons$Pad$set_r$(x0, x1);

    function Mons$Object$set_pad_r$(_obj$1, _val$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1215 = self.pad;
                var $1216 = Mons$Object$set_pad$(_obj$1, Mons$Pad$set_r$($1215, _val$2));
                var $1214 = $1216;
                break;
        };
        return $1214;
    };
    const Mons$Object$set_pad_r = x0 => x1 => Mons$Object$set_pad_r$(x0, x1);

    function Mons$Pad$set_u$(_pad$1, _val$2) {
        var self = _pad$1;
        switch (self._) {
            case 'Mons.Pad.new':
                var $1218 = self.r;
                var $1219 = self.l;
                var $1220 = self.d;
                var $1221 = Mons$Pad$new$($1218, _val$2, $1219, $1220);
                var $1217 = $1221;
                break;
        };
        return $1217;
    };
    const Mons$Pad$set_u = x0 => x1 => Mons$Pad$set_u$(x0, x1);

    function Mons$Object$set_pad_u$(_obj$1, _val$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1223 = self.pad;
                var $1224 = Mons$Object$set_pad$(_obj$1, Mons$Pad$set_u$($1223, _val$2));
                var $1222 = $1224;
                break;
        };
        return $1222;
    };
    const Mons$Object$set_pad_u = x0 => x1 => Mons$Object$set_pad_u$(x0, x1);

    function Mons$Pad$set_l$(_pad$1, _val$2) {
        var self = _pad$1;
        switch (self._) {
            case 'Mons.Pad.new':
                var $1226 = self.r;
                var $1227 = self.u;
                var $1228 = self.d;
                var $1229 = Mons$Pad$new$($1226, $1227, _val$2, $1228);
                var $1225 = $1229;
                break;
        };
        return $1225;
    };
    const Mons$Pad$set_l = x0 => x1 => Mons$Pad$set_l$(x0, x1);

    function Mons$Object$set_pad_l$(_obj$1, _val$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1231 = self.pad;
                var $1232 = Mons$Object$set_pad$(_obj$1, Mons$Pad$set_l$($1231, _val$2));
                var $1230 = $1232;
                break;
        };
        return $1230;
    };
    const Mons$Object$set_pad_l = x0 => x1 => Mons$Object$set_pad_l$(x0, x1);

    function Mons$Pad$set_d$(_pad$1, _val$2) {
        var self = _pad$1;
        switch (self._) {
            case 'Mons.Pad.new':
                var $1234 = self.r;
                var $1235 = self.u;
                var $1236 = self.l;
                var $1237 = Mons$Pad$new$($1234, $1235, $1236, _val$2);
                var $1233 = $1237;
                break;
        };
        return $1233;
    };
    const Mons$Pad$set_d = x0 => x1 => Mons$Pad$set_d$(x0, x1);

    function Mons$Object$set_pad_d$(_obj$1, _val$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1239 = self.pad;
                var $1240 = Mons$Object$set_pad$(_obj$1, Mons$Pad$set_d$($1239, _val$2));
                var $1238 = $1240;
                break;
        };
        return $1238;
    };
    const Mons$Object$set_pad_d = x0 => x1 => Mons$Object$set_pad_d$(x0, x1);

    function Mons$dir_to_set_pad$(_dir$1) {
        var self = _dir$1;
        switch (self._) {
            case 'Mons.Dir.right':
                var $1242 = Mons$Object$set_pad_r;
                var $1241 = $1242;
                break;
            case 'Mons.Dir.up':
                var $1243 = Mons$Object$set_pad_u;
                var $1241 = $1243;
                break;
            case 'Mons.Dir.left':
                var $1244 = Mons$Object$set_pad_l;
                var $1241 = $1244;
                break;
            case 'Mons.Dir.down':
                var $1245 = Mons$Object$set_pad_d;
                var $1241 = $1245;
                break;
        };
        return $1241;
    };
    const Mons$dir_to_set_pad = x0 => Mons$dir_to_set_pad$(x0);

    function Char$is_upper$(_char$1) {
        var $1246 = ((_char$1 >= 65) && (_char$1 <= 90));
        return $1246;
    };
    const Char$is_upper = x0 => Char$is_upper$(x0);

    function Mons$Game$update$(_fn$1, _pos$2, _idx$3, _game$4) {
        var self = _game$4;
        switch (self._) {
            case 'Mons.Game.new':
                var $1248 = self.map;
                var _obj$10 = _fn$1(Mons$Map$get$(_pos$2, _idx$3, $1248));
                var _map$11 = Mons$Map$set$(_pos$2, _idx$3, _obj$10, $1248);
                var $1249 = Mons$Game$set_map$(_map$11, _game$4);
                var $1247 = $1249;
                break;
        };
        return $1247;
    };
    const Mons$Game$update = x0 => x1 => x2 => x3 => Mons$Game$update$(x0, x1, x2, x3);

    function Mons$Game$walk$(_cmd$1, _pos$2, _idx$3, _game$4) {
        var self = _game$4;
        switch (self._) {
            case 'Mons.Game.new':
                var self = Mons$key_to_dir$(_cmd$1);
                switch (self._) {
                    case 'Maybe.some':
                        var $1252 = self.value;
                        var _dir$11 = $1252;
                        var _set_pad$12 = Mons$dir_to_set_pad$(_dir$11);
                        var _flag$13 = Char$is_upper$(_cmd$1);
                        var $1253 = Mons$Game$update$((_obj$14 => {
                            var $1254 = _set_pad$12(_obj$14)(_flag$13);
                            return $1254;
                        }), _pos$2, _idx$3, _game$4);
                        var $1251 = $1253;
                        break;
                    case 'Maybe.none':
                        var $1255 = _game$4;
                        var $1251 = $1255;
                        break;
                };
                var $1250 = $1251;
                break;
        };
        return $1250;
    };
    const Mons$Game$walk = x0 => x1 => x2 => x3 => Mons$Game$walk$(x0, x1, x2, x3);

    function Mons$Kind$is_mage$(_kind$1) {
        var self = _kind$1;
        switch (self._) {
            case 'Mons.Kind.Mons':
                var $1257 = self.ele;
                var self = $1257;
                switch (self._) {
                    case 'Mons.Kind.mons.HERO':
                    case 'Mons.Kind.mons.BEHOLDER':
                    case 'Mons.Kind.mons.ZOIO':
                    case 'Mons.Kind.mons.CYCLOPE':
                    case 'Mons.Kind.mons.POISOLICK':
                    case 'Mons.Kind.mons.TROWL':
                    case 'Mons.Kind.mons.MIMIC':
                    case 'Mons.Kind.mons.MIMIC2':
                    case 'Mons.Kind.mons.AZULA':
                    case 'Mons.Kind.mons.EMERELDER':
                    case 'Mons.Kind.mons.EMERELDER2':
                        var $1259 = Bool$false;
                        var $1258 = $1259;
                        break;
                    case 'Mons.Kind.mons.MAGE':
                        var $1260 = Bool$true;
                        var $1258 = $1260;
                        break;
                };
                var $1256 = $1258;
                break;
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Terrain':
            case 'Mons.Kind.Interactive':
                var $1261 = Bool$false;
                var $1256 = $1261;
                break;
        };
        return $1256;
    };
    const Mons$Kind$is_mage = x0 => Mons$Kind$is_mage$(x0);

    function Mons$Object$set_bag$(_bag$1, _obj$2) {
        var self = _obj$2;
        switch (self._) {
            case 'Mons.Object.new':
                var $1263 = self.kin;
                var $1264 = self.dir;
                var $1265 = self.pad;
                var $1266 = self.ani;
                var $1267 = self.dmg;
                var $1268 = self.mon;
                var $1269 = self.bos;
                var $1270 = self.cap;
                var $1271 = self.idl;
                var $1272 = self.eff;
                var $1273 = Mons$Object$new$($1263, $1264, $1265, $1266, $1267, _bag$1, $1268, $1269, $1270, $1271, $1272);
                var $1262 = $1273;
                break;
        };
        return $1262;
    };
    const Mons$Object$set_bag = x0 => x1 => Mons$Object$set_bag$(x0, x1);
    const Mons$Kind$mons$POISOLICK = ({
        _: 'Mons.Kind.mons.POISOLICK'
    });
    const Mons$Kind$mons$AZULA = ({
        _: 'Mons.Kind.mons.AZULA'
    });
    const Mons$Kind$mons$EMERELDER = ({
        _: 'Mons.Kind.mons.EMERELDER'
    });

    function Mons$Object$set_dmg$(_obj$1, _dmg$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1275 = self.kin;
                var $1276 = self.dir;
                var $1277 = self.pad;
                var $1278 = self.ani;
                var $1279 = self.bag;
                var $1280 = self.mon;
                var $1281 = self.bos;
                var $1282 = self.cap;
                var $1283 = self.idl;
                var $1284 = self.eff;
                var $1285 = Mons$Object$new$($1275, $1276, $1277, $1278, _dmg$2, $1279, $1280, $1281, $1282, $1283, $1284);
                var $1274 = $1285;
                break;
        };
        return $1274;
    };
    const Mons$Object$set_dmg = x0 => x1 => Mons$Object$set_dmg$(x0, x1);
    const Nat$ltn = a0 => a1 => (a0 < a1);

    function List$pure$(_x$2) {
        var $1286 = List$cons$(_x$2, List$nil);
        return $1286;
    };
    const List$pure = x0 => List$pure$(x0);

    function List$append$(_as$2, _a$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $1288 = self.head;
                var $1289 = self.tail;
                var $1290 = List$cons$($1288, List$append$($1289, _a$3));
                var $1287 = $1290;
                break;
            case 'List.nil':
                var $1291 = List$pure$(_a$3);
                var $1287 = $1291;
                break;
        };
        return $1287;
    };
    const List$append = x0 => x1 => List$append$(x0, x1);

    function Mons$Object$push_to_bag$(_obj$1, _hero$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1293 = self.kin;
                var self = _hero$2;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1295 = self.bag;
                        var _qtd$25 = (list_length($1295));
                        var self = $1293;
                        switch (self._) {
                            case 'Mons.Kind.Mons':
                                var _obj$30 = Mons$Object$set_dmg$(_obj$1, 0);
                                var self = (_qtd$25 < 3n);
                                if (self) {
                                    var _new_bag$31 = List$append$($1295, _obj$30);
                                    var $1298 = Mons$Object$set_bag$(_new_bag$31, _hero$2);
                                    var $1297 = $1298;
                                } else {
                                    var $1299 = _hero$2;
                                    var $1297 = $1299;
                                };
                                var $1296 = $1297;
                                break;
                            case 'Mons.Kind.Const':
                            case 'Mons.Kind.Terrain':
                            case 'Mons.Kind.Interactive':
                                var $1300 = _hero$2;
                                var $1296 = $1300;
                                break;
                        };
                        var $1294 = $1296;
                        break;
                };
                var $1292 = $1294;
                break;
        };
        return $1292;
    };
    const Mons$Object$push_to_bag = x0 => x1 => Mons$Object$push_to_bag$(x0, x1);

    function Mons$initial_mons$(_hero_obj$1, _pos$2, _hero_idx$3, _game$4) {
        var self = _hero_obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var _hero_obj$16 = Mons$Object$set_bag$(List$nil, _hero_obj$1);
                var _mon0_bag$17 = Mons$Object$new_of_kind$(Mons$Kind$Mons$(Mons$Kind$mons$POISOLICK, Bool$false, Mons$Type$normal, 2));
                var _mon1_bag$18 = Mons$Object$new_of_kind$(Mons$Kind$Mons$(Mons$Kind$mons$AZULA, Bool$false, Mons$Type$normal, 2));
                var _mon2_bag$19 = Mons$Object$new_of_kind$(Mons$Kind$Mons$(Mons$Kind$mons$EMERELDER, Bool$false, Mons$Type$normal, 2));
                var _hero_obj$20 = Mons$Object$push_to_bag$(_mon0_bag$17, _hero_obj$16);
                var _hero_obj$21 = Mons$Object$push_to_bag$(_mon1_bag$18, _hero_obj$20);
                var _hero_obj$22 = Mons$Object$push_to_bag$(_mon2_bag$19, _hero_obj$21);
                var $1302 = Mons$Game$map_set$(_pos$2, _hero_idx$3, _hero_obj$22, _game$4);
                var $1301 = $1302;
                break;
        };
        return $1301;
    };
    const Mons$initial_mons = x0 => x1 => x2 => x3 => Mons$initial_mons$(x0, x1, x2, x3);

    function Mons$Screen$intro_select$(_idx$1) {
        var $1303 = ({
            _: 'Mons.Screen.intro_select',
            'idx': _idx$1
        });
        return $1303;
    };
    const Mons$Screen$intro_select = x0 => Mons$Screen$intro_select$(x0);
    const Mons$Type$earth = ({
        _: 'Mons.Type.earth'
    });

    function Mons$Object$set_mon$(_idx$1, _obj$2) {
        var self = _obj$2;
        switch (self._) {
            case 'Mons.Object.new':
                var $1305 = self.kin;
                var $1306 = self.dir;
                var $1307 = self.pad;
                var $1308 = self.ani;
                var $1309 = self.dmg;
                var $1310 = self.bag;
                var $1311 = self.bos;
                var $1312 = self.cap;
                var $1313 = self.idl;
                var $1314 = self.eff;
                var $1315 = Mons$Object$new$($1305, $1306, $1307, $1308, $1309, $1310, _idx$1, $1311, $1312, $1313, $1314);
                var $1304 = $1315;
                break;
        };
        return $1304;
    };
    const Mons$Object$set_mon = x0 => x1 => Mons$Object$set_mon$(x0, x1);

    function Mons$Object$delete_init_mons$(_hero_obj$1) {
        var self = _hero_obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1317 = self.bag;
                var $1318 = self.mon;
                var _get_mon$13 = List$at$(U32$to_nat$($1318), $1317);
                var self = _get_mon$13;
                switch (self._) {
                    case 'Maybe.some':
                        var $1320 = self.value;
                        var $1321 = $1320;
                        var _cur_mon$14 = $1321;
                        break;
                    case 'Maybe.none':
                        var $1322 = Mons$Object$new_of_kind$(Mons$Kind$Mons$(Mons$Kind$mons$HERO, Bool$false, Mons$Type$earth, 2));
                        var _cur_mon$14 = $1322;
                        break;
                };
                var _hero_obj$15 = Mons$Object$set_bag$(List$nil, _hero_obj$1);
                var _hero_obj$16 = Mons$Object$push_to_bag$(_cur_mon$14, _hero_obj$15);
                var _hero_obj$17 = Mons$Object$set_mon$(0, _hero_obj$16);
                var $1319 = _hero_obj$17;
                var $1316 = $1319;
                break;
        };
        return $1316;
    };
    const Mons$Object$delete_init_mons = x0 => Mons$Object$delete_init_mons$(x0);
    const U32$gte = a0 => a1 => (a0 >= a1);

    function Mons$Game$adve_turn$(_hero_obj$1, _adve_obj$2, _game$3) {
        var self = _game$3;
        switch (self._) {
            case 'Mons.Game.new':
                var self = _hero_obj$1;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1325 = self.bag;
                        var self = _adve_obj$2;
                        switch (self._) {
                            case 'Mons.Object.new':
                                var _adve_hp$31 = Mons$Object$remaining_hp$(_adve_obj$2);
                                var _hero_hp$32 = Mons$Object$remaining_hp$(_hero_obj$1);
                                var _qtd_mon_bag$33 = (Number((list_length($1325))));
                                var _hero_pos$34 = Mons$Game$get_hero_pos$(_game$3);
                                var self = _hero_pos$34;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1328 = self.value;
                                        var $1329 = (($1328 & 0xFFF));
                                        var _pos_x$35 = $1329;
                                        break;
                                    case 'Maybe.none':
                                        var $1330 = 80;
                                        var _pos_x$35 = $1330;
                                        break;
                                };
                                var self = ((Math.max(_hero_hp$32 - _adve_hp$31, 0)) > 15);
                                if (self) {
                                    var $1331 = 2n;
                                    var $1327 = $1331;
                                } else {
                                    var self = ((_hero_hp$32 > 30) && (_hero_hp$32 < 25));
                                    if (self) {
                                        var $1333 = 2n;
                                        var $1332 = $1333;
                                    } else {
                                        var self = ((Math.max(_adve_hp$31 - _hero_hp$32, 0)) >= 8);
                                        if (self) {
                                            var $1335 = 1n;
                                            var $1334 = $1335;
                                        } else {
                                            var self = ((_qtd_mon_bag$33 > 1) && (_hero_hp$32 > 30));
                                            if (self) {
                                                var $1337 = 1n;
                                                var $1336 = $1337;
                                            } else {
                                                var self = (_hero_hp$32 === _adve_hp$31);
                                                if (self) {
                                                    var $1339 = 3n;
                                                    var $1338 = $1339;
                                                } else {
                                                    var self = ((!((_pos_x$35 % 2) === 0)) && (_hero_hp$32 < 15));
                                                    if (self) {
                                                        var $1341 = 1n;
                                                        var $1340 = $1341;
                                                    } else {
                                                        var self = ((Math.max(_adve_hp$31 - _hero_hp$32, 0)) > 15);
                                                        if (self) {
                                                            var $1343 = 0n;
                                                            var $1342 = $1343;
                                                        } else {
                                                            var self = ((_adve_hp$31 > _hero_hp$32) && (_hero_hp$32 > 30));
                                                            if (self) {
                                                                var $1345 = 0n;
                                                                var $1344 = $1345;
                                                            } else {
                                                                var self = (_hero_hp$32 > 20);
                                                                if (self) {
                                                                    var $1347 = 1n;
                                                                    var $1346 = $1347;
                                                                } else {
                                                                    var self = (((_pos_x$35 % 2) === 0) && (_hero_hp$32 < 15));
                                                                    if (self) {
                                                                        var $1349 = 1n;
                                                                        var $1348 = $1349;
                                                                    } else {
                                                                        var self = (_hero_hp$32 < 5);
                                                                        if (self) {
                                                                            var $1351 = 0n;
                                                                            var $1350 = $1351;
                                                                        } else {
                                                                            var $1352 = 0n;
                                                                            var $1350 = $1352;
                                                                        };
                                                                        var $1348 = $1350;
                                                                    };
                                                                    var $1346 = $1348;
                                                                };
                                                                var $1344 = $1346;
                                                            };
                                                            var $1342 = $1344;
                                                        };
                                                        var $1340 = $1342;
                                                    };
                                                    var $1338 = $1340;
                                                };
                                                var $1336 = $1338;
                                            };
                                            var $1334 = $1336;
                                        };
                                        var $1332 = $1334;
                                    };
                                    var $1327 = $1332;
                                };
                                var $1326 = $1327;
                                break;
                        };
                        var $1324 = $1326;
                        break;
                };
                var $1323 = $1324;
                break;
        };
        return $1323;
    };
    const Mons$Game$adve_turn = x0 => x1 => x2 => Mons$Game$adve_turn$(x0, x1, x2);

    function Mons$Effect$upd_initial_eff$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1354 = self.sleep;
                var $1355 = self.burn;
                var $1356 = self.protect;
                var $1357 = self.minimize;
                var $1358 = self.invulnerable;
                var $1359 = self.poison;
                var $1360 = Mons$Effect$new$($1354, (Math.max($1355 - 1, 0)), $1356, $1357, $1358, 0, $1359, Bool$false);
                var $1353 = $1360;
                break;
        };
        return $1353;
    };
    const Mons$Effect$upd_initial_eff = x0 => Mons$Effect$upd_initial_eff$(x0);

    function Mons$Object$set_eff$(_eff$1, _obj$2) {
        var self = _obj$2;
        switch (self._) {
            case 'Mons.Object.new':
                var $1362 = self.kin;
                var $1363 = self.dir;
                var $1364 = self.pad;
                var $1365 = self.ani;
                var $1366 = self.dmg;
                var $1367 = self.bag;
                var $1368 = self.mon;
                var $1369 = self.bos;
                var $1370 = self.cap;
                var $1371 = self.idl;
                var $1372 = Mons$Object$new$($1362, $1363, $1364, $1365, $1366, $1367, $1368, $1369, $1370, $1371, _eff$1);
                var $1361 = $1372;
                break;
        };
        return $1361;
    };
    const Mons$Object$set_eff = x0 => x1 => Mons$Object$set_eff$(x0, x1);

    function Mons$Skill$update_mon_obj$(_hero_obj$1, _obj_updated$2, _pos$3, _idx$4, _game$5) {
        var self = _hero_obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1374 = self.bag;
                var $1375 = self.mon;
                var _qtd$17 = (list_length($1374));
                var self = (_qtd$17 === 0n);
                if (self) {
                    var $1377 = Mons$Game$map_set$(_pos$3, _idx$4, _obj_updated$2, _game$5);
                    var $1376 = $1377;
                } else {
                    var _idx_nat$18 = U32$to_nat$($1375);
                    var _new_bag$19 = List$update_at$(_idx_nat$18, (_a$19 => {
                        var $1379 = _obj_updated$2;
                        return $1379;
                    }), $1374);
                    var _hero_obj$20 = Mons$Object$set_bag$(_new_bag$19, _hero_obj$1);
                    var $1378 = Mons$Game$map_set$(_pos$3, _idx$4, _hero_obj$20, _game$5);
                    var $1376 = $1378;
                };
                var $1373 = $1376;
                break;
        };
        return $1373;
    };
    const Mons$Skill$update_mon_obj = x0 => x1 => x2 => x3 => x4 => Mons$Skill$update_mon_obj$(x0, x1, x2, x3, x4);

    function Mons$Effect$has_invulnerable$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1381 = self.invulnerable;
                var self = $1381;
                switch (self._) {
                    case 'Pair.new':
                        var $1383 = self.fst;
                        var $1384 = $1383;
                        var $1382 = $1384;
                        break;
                };
                var $1380 = $1382;
                break;
        };
        return $1380;
    };
    const Mons$Effect$has_invulnerable = x0 => Mons$Effect$has_invulnerable$(x0);

    function Mons$Effect$has_burn$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1386 = self.burn;
                var $1387 = ($1386 > 0);
                var $1385 = $1387;
                break;
        };
        return $1385;
    };
    const Mons$Effect$has_burn = x0 => Mons$Effect$has_burn$(x0);

    function Mons$Effect$has_hit$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1389 = self.hit;
                var $1390 = ($1389 > 0);
                var $1388 = $1390;
                break;
        };
        return $1388;
    };
    const Mons$Effect$has_hit = x0 => Mons$Effect$has_hit$(x0);

    function Mons$Effect$has_poison$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1392 = self.poison;
                var $1393 = $1392;
                var $1391 = $1393;
                break;
        };
        return $1391;
    };
    const Mons$Effect$has_poison = x0 => Mons$Effect$has_poison$(x0);

    function Mons$Skill$apply_inital_eff_dmg$(_eff$1, _mhp$2, _idx$3) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1395 = self.hit;
                var self = (_idx$3 === 1);
                if (self) {
                    var $1397 = "adve ";
                    var _player$12 = $1397;
                } else {
                    var $1398 = "hero ";
                    var _player$12 = $1398;
                };
                var self = Mons$Effect$has_invulnerable$(_eff$1);
                if (self) {
                    var $1399 = 0;
                    var $1396 = $1399;
                } else {
                    var self = Mons$Effect$has_burn$(_eff$1);
                    if (self) {
                        var $1401 = ((_mhp$2 / 16) >>> 0);
                        var _dmg_burn$13 = $1401;
                    } else {
                        var $1402 = 0;
                        var _dmg_burn$13 = $1402;
                    };
                    var self = Mons$Effect$has_hit$(_eff$1);
                    if (self) {
                        var $1403 = $1395;
                        var _dmg_hit$14 = $1403;
                    } else {
                        var $1404 = 0;
                        var _dmg_hit$14 = $1404;
                    };
                    var self = Mons$Effect$has_poison$(_eff$1);
                    if (self) {
                        var $1405 = ((_mhp$2 / 16) >>> 0);
                        var _dmg_poison$15 = $1405;
                    } else {
                        var $1406 = 0;
                        var _dmg_poison$15 = $1406;
                    };
                    var _dmg$16 = ((_dmg_poison$15 + ((_dmg_burn$13 + _dmg_hit$14) >>> 0)) >>> 0);
                    var $1400 = _dmg$16;
                    var $1396 = $1400;
                };
                var $1394 = $1396;
                break;
        };
        return $1394;
    };
    const Mons$Skill$apply_inital_eff_dmg = x0 => x1 => x2 => Mons$Skill$apply_inital_eff_dmg$(x0, x1, x2);

    function Mons$Effect$has_protect$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1408 = self.protect;
                var _turn$10 = Pair$fst$($1408);
                var $1409 = (_turn$10 === 1);
                var $1407 = $1409;
                break;
        };
        return $1407;
    };
    const Mons$Effect$has_protect = x0 => Mons$Effect$has_protect$(x0);

    function Mons$Effect$has_minimize$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1411 = self.minimize;
                var self = $1411;
                switch (self._) {
                    case 'Pair.new':
                        var $1413 = self.fst;
                        var $1414 = ($1413 > 0);
                        var $1412 = $1414;
                        break;
                };
                var $1410 = $1412;
                break;
        };
        return $1410;
    };
    const Mons$Effect$has_minimize = x0 => Mons$Effect$has_minimize$(x0);

    function Mons$Object$get_dmg$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1416 = self.dmg;
                var $1417 = $1416;
                var $1415 = $1417;
                break;
        };
        return $1415;
    };
    const Mons$Object$get_dmg = x0 => Mons$Object$get_dmg$(x0);

    function Mons$Object$hit$(_obj$1, _dmg$2) {
        var $1418 = Mons$Object$set_dmg$(_obj$1, ((Mons$Object$get_dmg$(_obj$1) + _dmg$2) >>> 0));
        return $1418;
    };
    const Mons$Object$hit = x0 => x1 => Mons$Object$hit$(x0, x1);

    function Mons$Skill$damage_eff$(_obj$1, _pos$2, _idx$3, _dmg$4, _game$5) {
        var _obj_mon$6 = Mons$Object$get_current_mon$(_obj$1);
        var self = _obj_mon$6;
        switch (self._) {
            case 'Mons.Object.new':
                var $1420 = self.eff;
                var self = Mons$Effect$has_invulnerable$($1420);
                if (self) {
                    var $1422 = _game$5;
                    var $1421 = $1422;
                } else {
                    var self = (_idx$3 === 1);
                    if (self) {
                        var $1424 = "adve ";
                        var _player$18 = $1424;
                    } else {
                        var $1425 = "hero ";
                        var _player$18 = $1425;
                    };
                    var self = Mons$Effect$has_protect$($1420);
                    if (self) {
                        var $1426 = ((_dmg$4 / 2) >>> 0);
                        var _dmg$19 = $1426;
                    } else {
                        var $1427 = _dmg$4;
                        var _dmg$19 = $1427;
                    };
                    var self = Mons$Effect$has_minimize$($1420);
                    if (self) {
                        var $1428 = (Math.max(_dmg$19 - ((_dmg$19 / 4) >>> 0), 0));
                        var _dmg$20 = $1428;
                    } else {
                        var $1429 = _dmg$19;
                        var _dmg$20 = $1429;
                    };
                    var _obj_mon$21 = Mons$Object$hit$(_obj_mon$6, _dmg$20);
                    var $1423 = Mons$Skill$update_mon_obj$(_obj$1, _obj_mon$21, _pos$2, _idx$3, _game$5);
                    var $1421 = $1423;
                };
                var $1419 = $1421;
                break;
        };
        return $1419;
    };
    const Mons$Skill$damage_eff = x0 => x1 => x2 => x3 => x4 => Mons$Skill$damage_eff$(x0, x1, x2, x3, x4);

    function Mons$Skill$apply_inital_eff$(_hero_idx$1, _adve_idx$2, _pos$3, _game$4) {
        var self = _game$4;
        switch (self._) {
            case 'Mons.Game.new':
                var $1431 = self.map;
                var _hero_obj$10 = Mons$Map$get$(_pos$3, _hero_idx$1, $1431);
                var _hero_mon_obj$11 = Mons$Object$get_current_mon$(_hero_obj$10);
                var self = _hero_mon_obj$11;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1433 = self.kin;
                        var $1434 = self.eff;
                        var self = Mons$Kind$attr$($1433);
                        switch (self._) {
                            case 'Mons.Attr.new':
                                var $1436 = self.mhp;
                                var _upd_effect$33 = Mons$Effect$upd_initial_eff$($1434);
                                var _hero_mon_obj$34 = Mons$Object$set_eff$(_upd_effect$33, _hero_mon_obj$11);
                                var _game$35 = Mons$Skill$update_mon_obj$(_hero_obj$10, _hero_mon_obj$34, _pos$3, _hero_idx$1, _game$4);
                                var _hero_dmg$36 = Mons$Skill$apply_inital_eff_dmg$($1434, $1436, _hero_idx$1);
                                var _game$37 = Mons$Skill$damage_eff$(_hero_obj$10, _pos$3, _hero_idx$1, _hero_dmg$36, _game$35);
                                var _adve_obj$38 = Mons$Map$get$(_pos$3, _adve_idx$2, $1431);
                                var self = _adve_obj$38;
                                switch (self._) {
                                    case 'Mons.Object.new':
                                        var $1438 = self.kin;
                                        var $1439 = self.eff;
                                        var self = Mons$Kind$attr$($1438);
                                        switch (self._) {
                                            case 'Mons.Attr.new':
                                                var $1441 = self.mhp;
                                                var _upd_effect$60 = Mons$Effect$upd_initial_eff$($1439);
                                                var _adve_obj$61 = Mons$Object$set_eff$(_upd_effect$60, _adve_obj$38);
                                                var _adve_dmg$62 = Mons$Skill$apply_inital_eff_dmg$($1439, $1441, _adve_idx$2);
                                                var _game$63 = Mons$Skill$damage_eff$(_adve_obj$61, _pos$3, _adve_idx$2, _adve_dmg$62, _game$37);
                                                var $1442 = _game$63;
                                                var $1440 = $1442;
                                                break;
                                        };
                                        var $1437 = $1440;
                                        break;
                                };
                                var $1435 = $1437;
                                break;
                        };
                        var $1432 = $1435;
                        break;
                };
                var $1430 = $1432;
                break;
        };
        return $1430;
    };
    const Mons$Skill$apply_inital_eff = x0 => x1 => x2 => x3 => Mons$Skill$apply_inital_eff$(x0, x1, x2, x3);

    function Mons$Effect$has_sleep$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1444 = self.sleep;
                var _turn$10 = Pair$fst$($1444);
                var $1445 = (_turn$10 === 1);
                var $1443 = $1445;
                break;
        };
        return $1443;
    };
    const Mons$Effect$has_sleep = x0 => Mons$Effect$has_sleep$(x0);

    function Mons$Type$skill_n_type$(_val$1, _source_obj$2, _target_obj$3) {
        var $1446 = 1;
        return $1446;
    };
    const Mons$Type$skill_n_type = x0 => x1 => x2 => Mons$Type$skill_n_type$(x0, x1, x2);

    function Mons$Object$heal$(_obj$1, _val$2) {
        var $1447 = Mons$Object$set_dmg$(_obj$1, (Math.max(Mons$Object$get_dmg$(_obj$1) - _val$2, 0)));
        return $1447;
    };
    const Mons$Object$heal = x0 => x1 => Mons$Object$heal$(x0, x1);

    function Mons$Skill$heal_eff$(_obj$1, _pos$2, _idx$3, _val$4, _game$5) {
        var _obj_updated$6 = Mons$Object$heal$(Mons$Object$get_current_mon$(_obj$1), _val$4);
        var self = Mons$Object$is_obj_defeated$(_obj_updated$6);
        if (self) {
            var $1449 = _game$5;
            var $1448 = $1449;
        } else {
            var $1450 = Mons$Skill$update_mon_obj$(_obj$1, _obj_updated$6, _pos$2, _idx$3, _game$5);
            var $1448 = $1450;
        };
        return $1448;
    };
    const Mons$Skill$heal_eff = x0 => x1 => x2 => x3 => x4 => Mons$Skill$heal_eff$(x0, x1, x2, x3, x4);

    function Mons$Effect$set_invulnerable$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1452 = self.eff;
                var self = $1452;
                switch (self._) {
                    case 'Mons.Effect.new':
                        var $1454 = self.sleep;
                        var $1455 = self.burn;
                        var $1456 = self.protect;
                        var $1457 = self.minimize;
                        var $1458 = self.invulnerable;
                        var $1459 = self.hit;
                        var $1460 = self.poison;
                        var $1461 = self.swap_agi;
                        var self = $1458;
                        switch (self._) {
                            case 'Pair.new':
                                var _new_eff$23 = Mons$Effect$new$($1454, $1455, $1456, $1457, Pair$new$(Bool$true, Bool$true), $1459, $1460, $1461);
                                var $1463 = Mons$Object$set_eff$(_new_eff$23, _obj$1);
                                var $1462 = $1463;
                                break;
                        };
                        var $1453 = $1462;
                        break;
                };
                var $1451 = $1453;
                break;
        };
        return $1451;
    };
    const Mons$Effect$set_invulnerable = x0 => Mons$Effect$set_invulnerable$(x0);

    function Mons$Skill$invulnerable_eff$(_obj$1, _pos$2, _idx$3, _game$4) {
        var _obj_updated$5 = Mons$Effect$set_invulnerable$(Mons$Object$get_current_mon$(_obj$1));
        var $1464 = Mons$Skill$update_mon_obj$(_obj$1, _obj_updated$5, _pos$2, _idx$3, _game$4);
        return $1464;
    };
    const Mons$Skill$invulnerable_eff = x0 => x1 => x2 => x3 => Mons$Skill$invulnerable_eff$(x0, x1, x2, x3);

    function Mons$Effect$set_hit$(_obj$1, _val$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1466 = self.eff;
                var self = $1466;
                switch (self._) {
                    case 'Mons.Effect.new':
                        var $1468 = self.sleep;
                        var $1469 = self.burn;
                        var $1470 = self.protect;
                        var $1471 = self.minimize;
                        var $1472 = self.invulnerable;
                        var $1473 = self.poison;
                        var $1474 = self.swap_agi;
                        var _new_eff$22 = Mons$Effect$new$($1468, $1469, $1470, $1471, $1472, _val$2, $1473, $1474);
                        var $1475 = Mons$Object$set_eff$(_new_eff$22, _obj$1);
                        var $1467 = $1475;
                        break;
                };
                var $1465 = $1467;
                break;
        };
        return $1465;
    };
    const Mons$Effect$set_hit = x0 => x1 => Mons$Effect$set_hit$(x0, x1);

    function Mons$Skill$hit_next_eff$(_obj$1, _val$2, _pos$3, _idx$4, _game$5) {
        var _obj_updated$6 = Mons$Effect$set_hit$(Mons$Object$get_current_mon$(_obj$1), _val$2);
        var $1476 = Mons$Skill$update_mon_obj$(_obj$1, _obj_updated$6, _pos$3, _idx$4, _game$5);
        return $1476;
    };
    const Mons$Skill$hit_next_eff = x0 => x1 => x2 => x3 => x4 => Mons$Skill$hit_next_eff$(x0, x1, x2, x3, x4);

    function Mons$Effect$set_burn$(_obj$1, _turns$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1478 = self.eff;
                var self = $1478;
                switch (self._) {
                    case 'Mons.Effect.new':
                        var $1480 = self.sleep;
                        var $1481 = self.protect;
                        var $1482 = self.minimize;
                        var $1483 = self.invulnerable;
                        var $1484 = self.hit;
                        var $1485 = self.poison;
                        var $1486 = self.swap_agi;
                        var _new_eff$22 = Mons$Effect$new$($1480, _turns$2, $1481, $1482, $1483, $1484, $1485, $1486);
                        var $1487 = Mons$Object$set_eff$(_new_eff$22, _obj$1);
                        var $1479 = $1487;
                        break;
                };
                var $1477 = $1479;
                break;
        };
        return $1477;
    };
    const Mons$Effect$set_burn = x0 => x1 => Mons$Effect$set_burn$(x0, x1);

    function Mons$Skill$burn_eff$(_obj$1, _pos$2, _idx$3, _turns$4, _game$5) {
        var _obj_updated$6 = Mons$Effect$set_burn$(Mons$Object$get_current_mon$(_obj$1), _turns$4);
        var $1488 = Mons$Skill$update_mon_obj$(_obj$1, _obj_updated$6, _pos$2, _idx$3, _game$5);
        return $1488;
    };
    const Mons$Skill$burn_eff = x0 => x1 => x2 => x3 => x4 => Mons$Skill$burn_eff$(x0, x1, x2, x3, x4);

    function Mons$Effect$set_protect$(_obj$1, _turn$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1490 = self.eff;
                var self = $1490;
                switch (self._) {
                    case 'Mons.Effect.new':
                        var $1492 = self.sleep;
                        var $1493 = self.burn;
                        var $1494 = self.minimize;
                        var $1495 = self.invulnerable;
                        var $1496 = self.hit;
                        var $1497 = self.poison;
                        var $1498 = self.swap_agi;
                        var _new_eff$22 = Mons$Effect$new$($1492, $1493, Pair$new$(_turn$2, Bool$true), $1494, $1495, $1496, $1497, $1498);
                        var $1499 = Mons$Object$set_eff$(_new_eff$22, _obj$1);
                        var $1491 = $1499;
                        break;
                };
                var $1489 = $1491;
                break;
        };
        return $1489;
    };
    const Mons$Effect$set_protect = x0 => x1 => Mons$Effect$set_protect$(x0, x1);

    function Mons$Skill$protect_eff$(_obj$1, _pos$2, _idx$3, _turn$4, _game$5) {
        var _obj_updated$6 = Mons$Effect$set_protect$(Mons$Object$get_current_mon$(_obj$1), _turn$4);
        var $1500 = Mons$Skill$update_mon_obj$(_obj$1, _obj_updated$6, _pos$2, _idx$3, _game$5);
        return $1500;
    };
    const Mons$Skill$protect_eff = x0 => x1 => x2 => x3 => x4 => Mons$Skill$protect_eff$(x0, x1, x2, x3, x4);

    function Mons$Effect$set_poison$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1502 = self.eff;
                var self = $1502;
                switch (self._) {
                    case 'Mons.Effect.new':
                        var $1504 = self.sleep;
                        var $1505 = self.burn;
                        var $1506 = self.protect;
                        var $1507 = self.minimize;
                        var $1508 = self.invulnerable;
                        var $1509 = self.hit;
                        var $1510 = self.swap_agi;
                        var _new_eff$21 = Mons$Effect$new$($1504, $1505, $1506, $1507, $1508, $1509, Bool$true, $1510);
                        var $1511 = Mons$Object$set_eff$(_new_eff$21, _obj$1);
                        var $1503 = $1511;
                        break;
                };
                var $1501 = $1503;
                break;
        };
        return $1501;
    };
    const Mons$Effect$set_poison = x0 => Mons$Effect$set_poison$(x0);

    function Mons$Skill$poison_eff$(_obj$1, _pos$2, _idx$3, _game$4) {
        var $1512 = Mons$Skill$update_mon_obj$(_obj$1, Mons$Effect$set_poison$(Mons$Object$get_current_mon$(_obj$1)), _pos$2, _idx$3, _game$4);
        return $1512;
    };
    const Mons$Skill$poison_eff = x0 => x1 => x2 => x3 => Mons$Skill$poison_eff$(x0, x1, x2, x3);

    function Mons$Skill$critical_hit$(_mhp$1, _hit_val$2, _perc$3, _tik$4) {
        var self = ((_tik$4 % _perc$3) === 0);
        if (self) {
            var $1514 = ((((_mhp$1 / 16) >>> 0) + _hit_val$2) >>> 0);
            var $1513 = $1514;
        } else {
            var $1515 = _hit_val$2;
            var $1513 = $1515;
        };
        return $1513;
    };
    const Mons$Skill$critical_hit = x0 => x1 => x2 => x3 => Mons$Skill$critical_hit$(x0, x1, x2, x3);

    function Mons$Skill$is_critical$(_perc$1, _tik$2) {
        var $1516 = ((_tik$2 % _perc$1) === 0);
        return $1516;
    };
    const Mons$Skill$is_critical = x0 => x1 => Mons$Skill$is_critical$(x0, x1);

    function Mons$Kind$get_agi$(_kind$1) {
        var self = _kind$1;
        switch (self._) {
            case 'Mons.Kind.Mons':
                var $1518 = self.agi;
                var $1519 = $1518;
                var $1517 = $1519;
                break;
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Terrain':
            case 'Mons.Kind.Interactive':
                var $1520 = 3;
                var $1517 = $1520;
                break;
        };
        return $1517;
    };
    const Mons$Kind$get_agi = x0 => Mons$Kind$get_agi$(x0);

    function Mons$Effect$set_minimize$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1522 = self.eff;
                var self = $1522;
                switch (self._) {
                    case 'Mons.Effect.new':
                        var $1524 = self.sleep;
                        var $1525 = self.burn;
                        var $1526 = self.protect;
                        var $1527 = self.invulnerable;
                        var $1528 = self.hit;
                        var $1529 = self.poison;
                        var $1530 = self.swap_agi;
                        var _new_eff$21 = Mons$Effect$new$($1524, $1525, $1526, Pair$new$(2, Bool$true), $1527, $1528, $1529, $1530);
                        var $1531 = Mons$Object$set_eff$(_new_eff$21, _obj$1);
                        var $1523 = $1531;
                        break;
                };
                var $1521 = $1523;
                break;
        };
        return $1521;
    };
    const Mons$Effect$set_minimize = x0 => Mons$Effect$set_minimize$(x0);

    function Mons$Skill$minimize_eff$(_obj$1, _pos$2, _idx$3, _game$4) {
        var _obj_updated$5 = Mons$Effect$set_minimize$(Mons$Object$get_current_mon$(_obj$1));
        var $1532 = Mons$Skill$update_mon_obj$(_obj$1, _obj_updated$5, _pos$2, _idx$3, _game$4);
        return $1532;
    };
    const Mons$Skill$minimize_eff = x0 => x1 => x2 => x3 => Mons$Skill$minimize_eff$(x0, x1, x2, x3);

    function Mons$Effect$set_sleep$(_obj$1, _turn$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1534 = self.eff;
                var self = $1534;
                switch (self._) {
                    case 'Mons.Effect.new':
                        var $1536 = self.burn;
                        var $1537 = self.protect;
                        var $1538 = self.minimize;
                        var $1539 = self.invulnerable;
                        var $1540 = self.hit;
                        var $1541 = self.poison;
                        var $1542 = self.swap_agi;
                        var _new_eff$22 = Mons$Effect$new$(Pair$new$(_turn$2, Bool$true), $1536, $1537, $1538, $1539, $1540, $1541, $1542);
                        var $1543 = Mons$Object$set_eff$(_new_eff$22, _obj$1);
                        var $1535 = $1543;
                        break;
                };
                var $1533 = $1535;
                break;
        };
        return $1533;
    };
    const Mons$Effect$set_sleep = x0 => x1 => Mons$Effect$set_sleep$(x0, x1);

    function Mons$Skill$sleep_eff$(_obj$1, _pos$2, _idx$3, _turn$4, _game$5) {
        var _obj_updated$6 = Mons$Effect$set_sleep$(Mons$Object$get_current_mon$(_obj$1), _turn$4);
        var $1544 = Mons$Skill$update_mon_obj$(_obj$1, _obj_updated$6, _pos$2, _idx$3, _game$5);
        return $1544;
    };
    const Mons$Skill$sleep_eff = x0 => x1 => x2 => x3 => x4 => Mons$Skill$sleep_eff$(x0, x1, x2, x3, x4);

    function Mons$Skill$cast$(_pos$1, _source$2, _target$3, _skill$4, _game$5) {
        var self = _game$5;
        switch (self._) {
            case 'Mons.Game.new':
                var $1546 = self.map;
                var $1547 = self.tik;
                var _source_obj$11 = Mons$Map$get$(_pos$1, _source$2, $1546);
                var _source_mon$12 = Mons$Object$get_current_mon$(_source_obj$11);
                var _target_obj$13 = Mons$Map$get$(_pos$1, _target$3, $1546);
                var _target_mon$14 = Mons$Object$get_current_mon$(_target_obj$13);
                var self = _source_mon$12;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1549 = self.kin;
                        var $1550 = self.eff;
                        var self = $1550;
                        switch (self._) {
                            case 'Mons.Effect.new':
                                var $1552 = self.protect;
                                var self = _target_mon$14;
                                switch (self._) {
                                    case 'Mons.Object.new':
                                        var $1554 = self.kin;
                                        var $1555 = self.eff;
                                        var self = $1555;
                                        switch (self._) {
                                            case 'Mons.Effect.new':
                                                var self = Mons$Kind$attr$($1549);
                                                switch (self._) {
                                                    case 'Mons.Attr.new':
                                                        var self = Mons$Kind$attr$($1554);
                                                        switch (self._) {
                                                            case 'Mons.Attr.new':
                                                                var $1559 = self.mhp;
                                                                var _light_val$73 = 2;
                                                                var _medium_val$74 = 4;
                                                                var _high_val$75 = 6;
                                                                var _can_attack$76 = (!Mons$Effect$has_sleep$($1550));
                                                                var self = _can_attack$76;
                                                                if (self) {
                                                                    var self = _skill$4;
                                                                    switch (self._) {
                                                                        case 'Mons.Skill.hit_4':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_medium_val$74, _source_mon$12, _target_mon$14);
                                                                            var $1562 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                            var $1561 = $1562;
                                                                            break;
                                                                        case 'Mons.Skill.hit_2':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_light_val$73, _source_mon$12, _target_mon$14);
                                                                            var $1563 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                            var $1561 = $1563;
                                                                            break;
                                                                        case 'Mons.Skill.heal':
                                                                            var $1564 = Mons$Skill$heal_eff$(_source_obj$11, _pos$1, _source$2, 3, _game$5);
                                                                            var $1561 = $1564;
                                                                            break;
                                                                        case 'Mons.Skill.none':
                                                                        case 'Mons.Skill.run':
                                                                        case 'Mons.Skill.agility':
                                                                            var $1565 = _game$5;
                                                                            var $1561 = $1565;
                                                                            break;
                                                                        case 'Mons.Skill.dig':
                                                                            var _game$77 = Mons$Skill$invulnerable_eff$(_source_obj$11, _pos$1, _source$2, _game$5);
                                                                            var _game$78 = Mons$Skill$hit_next_eff$(_target_obj$13, 3, _pos$1, _target$3, _game$77);
                                                                            var $1566 = _game$78;
                                                                            var $1561 = $1566;
                                                                            break;
                                                                        case 'Mons.Skill.sand_tomb':
                                                                            var _game$77 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, Mons$Type$skill_n_type$(_light_val$73, _source_mon$12, _target_mon$14), _game$5);
                                                                            var _game$78 = Mons$Skill$burn_eff$(_target_obj$13, _pos$1, _target$3, 5, _game$77);
                                                                            var $1567 = _game$78;
                                                                            var $1561 = $1567;
                                                                            break;
                                                                        case 'Mons.Skill.protect':
                                                                            var self = Pair$snd$($1552);
                                                                            if (self) {
                                                                                var $1569 = _game$5;
                                                                                var $1568 = $1569;
                                                                            } else {
                                                                                var $1570 = Mons$Skill$protect_eff$(_source_obj$11, _pos$1, _source$2, 2, _game$5);
                                                                                var $1568 = $1570;
                                                                            };
                                                                            var $1561 = $1568;
                                                                            break;
                                                                        case 'Mons.Skill.slam':
                                                                        case 'Mons.Skill.wing_attack':
                                                                        case 'Mons.Skill.thunder_wave':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_high_val$75, _source_mon$12, _target_mon$14);
                                                                            var $1571 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                            var $1561 = $1571;
                                                                            break;
                                                                        case 'Mons.Skill.counter':
                                                                            var _game$77 = Mons$Skill$heal_eff$(_source_obj$11, _pos$1, _source$2, _light_val$73, _game$5);
                                                                            var $1572 = Mons$Skill$burn_eff$(_target_obj$13, _pos$1, _target$3, 5, _game$77);
                                                                            var $1561 = $1572;
                                                                            break;
                                                                        case 'Mons.Skill.recover':
                                                                            var _val$77 = ((Mons$Object$remaining_hp$(_source_mon$12) / 4) >>> 0);
                                                                            var _game$78 = Mons$Skill$poison_eff$(_source_obj$11, _pos$1, _source$2, _game$5);
                                                                            var $1573 = Mons$Skill$heal_eff$(_source_obj$11, _pos$1, _source$2, _val$77, _game$78);
                                                                            var $1561 = $1573;
                                                                            break;
                                                                        case 'Mons.Skill.rock_smash':
                                                                            var _val$77 = Mons$Skill$critical_hit$($1559, _light_val$73, 2, $1547);
                                                                            var _game$78 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                            var $1574 = _game$78;
                                                                            var $1561 = $1574;
                                                                            break;
                                                                        case 'Mons.Skill.crunch':
                                                                            var _val$77 = Mons$Skill$critical_hit$($1559, _medium_val$74, 4, $1547);
                                                                            var _game$78 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                            var $1575 = _game$78;
                                                                            var $1561 = $1575;
                                                                            break;
                                                                        case 'Mons.Skill.sludge_bomb':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_light_val$73, _source_mon$12, _target_mon$14);
                                                                            var _game$78 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                            var self = Mons$Skill$is_critical$(3, $1547);
                                                                            if (self) {
                                                                                var $1577 = Mons$Skill$poison_eff$(_target_obj$13, _pos$1, _target$3, _game$78);
                                                                                var $1576 = $1577;
                                                                            } else {
                                                                                var $1578 = _game$78;
                                                                                var $1576 = $1578;
                                                                            };
                                                                            var $1561 = $1576;
                                                                            break;
                                                                        case 'Mons.Skill.gyro_ball':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_medium_val$74, _source_mon$12, _target_mon$14);
                                                                            var self = (Mons$Kind$get_agi$($1554) > Mons$Kind$get_agi$($1549));
                                                                            if (self) {
                                                                                var $1580 = ((((_val$77 / 2) >>> 0) + _val$77) >>> 0);
                                                                                var _val$78 = $1580;
                                                                            } else {
                                                                                var $1581 = _val$77;
                                                                                var _val$78 = $1581;
                                                                            };
                                                                            var _game$79 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$78, _game$5);
                                                                            var $1579 = _game$79;
                                                                            var $1561 = $1579;
                                                                            break;
                                                                        case 'Mons.Skill.iron_defense':
                                                                            var $1582 = Mons$Skill$minimize_eff$(_source_obj$11, _pos$1, _source$2, _game$5);
                                                                            var $1561 = $1582;
                                                                            break;
                                                                        case 'Mons.Skill.super_fang':
                                                                            var _adve_dmg$77 = ((Mons$Object$remaining_hp$(_source_mon$12) / 4) >>> 0);
                                                                            var _game$78 = Mons$Skill$burn_eff$(_source_obj$11, _pos$1, _target$3, 2, _game$5);
                                                                            var _game$79 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _adve_dmg$77, _game$78);
                                                                            var $1583 = _game$79;
                                                                            var $1561 = $1583;
                                                                            break;
                                                                        case 'Mons.Skill.hypnosis':
                                                                            var self = (Mons$Skill$is_critical$(2, $1547) && Mons$Effect$has_sleep$($1555));
                                                                            if (self) {
                                                                                var $1585 = Mons$Skill$sleep_eff$(_target_obj$13, _pos$1, _target$3, 2, _game$5);
                                                                                var $1584 = $1585;
                                                                            } else {
                                                                                var $1586 = _game$5;
                                                                                var $1584 = $1586;
                                                                            };
                                                                            var $1561 = $1584;
                                                                            break;
                                                                        case 'Mons.Skill.dream_eater':
                                                                            var self = Mons$Effect$has_sleep$($1555);
                                                                            if (self) {
                                                                                var _val$77 = Mons$Type$skill_n_type$(_high_val$75, _source_mon$12, _target_mon$14);
                                                                                var _game$78 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                                var $1588 = Mons$Skill$heal_eff$(_source_obj$11, _pos$1, _source$2, _val$77, _game$78);
                                                                                var $1587 = $1588;
                                                                            } else {
                                                                                var $1589 = _game$5;
                                                                                var $1587 = $1589;
                                                                            };
                                                                            var $1561 = $1587;
                                                                            break;
                                                                        case 'Mons.Skill.moonlight':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_medium_val$74, _source_mon$12, _target_mon$14);
                                                                            var self = Mons$Skill$is_critical$(5, $1547);
                                                                            if (self) {
                                                                                var _game$78 = Mons$Skill$sleep_eff$(_target_obj$13, _pos$1, _target$3, 2, _game$5);
                                                                                var $1591 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$78);
                                                                                var $1590 = $1591;
                                                                            } else {
                                                                                var $1592 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                                var $1590 = $1592;
                                                                            };
                                                                            var $1561 = $1590;
                                                                            break;
                                                                        case 'Mons.Skill.play_rough':
                                                                            var _val$77 = Mons$Skill$critical_hit$($1559, _medium_val$74, 5, $1547);
                                                                            var $1593 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                            var $1561 = $1593;
                                                                            break;
                                                                        case 'Mons.Skill.psychic':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_light_val$73, _source_mon$12, _target_mon$14);
                                                                            var self = Mons$Skill$is_critical$(10, $1547);
                                                                            if (self) {
                                                                                var _game$78 = Mons$Skill$sleep_eff$(_target_obj$13, _pos$1, _target$3, 1, _game$5);
                                                                                var _game$79 = Mons$Skill$hit_next_eff$(_target_obj$13, 3, _pos$1, _target$3, _game$78);
                                                                                var $1595 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$79);
                                                                                var $1594 = $1595;
                                                                            } else {
                                                                                var $1596 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                                var $1594 = $1596;
                                                                            };
                                                                            var $1561 = $1594;
                                                                            break;
                                                                        case 'Mons.Skill.ancient_power':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_medium_val$74, _source_mon$12, _target_mon$14);
                                                                            var self = Mons$Skill$is_critical$(10, $1547);
                                                                            if (self) {
                                                                                var _game$78 = Mons$Skill$sleep_eff$(_target_obj$13, _pos$1, _target$3, 1, _game$5);
                                                                                var $1598 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$78);
                                                                                var $1597 = $1598;
                                                                            } else {
                                                                                var $1599 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                                var $1597 = $1599;
                                                                            };
                                                                            var $1561 = $1597;
                                                                            break;
                                                                        case 'Mons.Skill.charge':
                                                                            var _val$77 = Mons$Type$skill_n_type$(_medium_val$74, _source_mon$12, _target_mon$14);
                                                                            var self = Mons$Effect$has_minimize$($1555);
                                                                            if (self) {
                                                                                var $1601 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, ((_val$77 * 2) >>> 0), _game$5);
                                                                                var $1600 = $1601;
                                                                            } else {
                                                                                var $1602 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, _val$77, _game$5);
                                                                                var $1600 = $1602;
                                                                            };
                                                                            var $1561 = $1600;
                                                                            break;
                                                                        case 'Mons.Skill.hero_kill':
                                                                            var $1603 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, 40, _game$5);
                                                                            var $1561 = $1603;
                                                                            break;
                                                                        case 'Mons.Skill.nightmare':
                                                                            var self = Mons$Effect$has_sleep$($1555);
                                                                            if (self) {
                                                                                var _hp$77 = Mons$Object$remaining_hp$(_target_mon$14);
                                                                                var $1605 = Mons$Skill$damage_eff$(_target_obj$13, _pos$1, _target$3, ((_hp$77 / 5) >>> 0), _game$5);
                                                                                var $1604 = $1605;
                                                                            } else {
                                                                                var $1606 = _game$5;
                                                                                var $1604 = $1606;
                                                                            };
                                                                            var $1561 = $1604;
                                                                            break;
                                                                    };
                                                                    var $1560 = $1561;
                                                                } else {
                                                                    var $1607 = _game$5;
                                                                    var $1560 = $1607;
                                                                };
                                                                var $1558 = $1560;
                                                                break;
                                                        };
                                                        var $1557 = $1558;
                                                        break;
                                                };
                                                var $1556 = $1557;
                                                break;
                                        };
                                        var $1553 = $1556;
                                        break;
                                };
                                var $1551 = $1553;
                                break;
                        };
                        var $1548 = $1551;
                        break;
                };
                var $1545 = $1548;
                break;
        };
        return $1545;
    };
    const Mons$Skill$cast = x0 => x1 => x2 => x3 => x4 => Mons$Skill$cast$(x0, x1, x2, x3, x4);
    const Mons$Skill$run = ({
        _: 'Mons.Skill.run'
    });

    function Mons$Game$hero_start_attacking$(_hero_kin$1, _adve_kin$2) {
        var _hero_agi$3 = Mons$Kind$get_agi$(_hero_kin$1);
        var _adve_agi$4 = Mons$Kind$get_agi$(_adve_kin$2);
        var $1608 = ((_hero_agi$3 < _adve_agi$4) || (_hero_agi$3 === _adve_agi$4));
        return $1608;
    };
    const Mons$Game$hero_start_attacking = x0 => x1 => Mons$Game$hero_start_attacking$(x0, x1);

    function Mons$Game$exec_turn$(_hero_obj$1, _adve_obj$2, _pos$3, _hero_idx$4, _adve_idx$5, _code_skill$6, _turn$7, _game$8) {
        var self = _game$8;
        switch (self._) {
            case 'Mons.Game.new':
                var _hero_mon_obj$14 = Mons$Object$get_current_mon$(_hero_obj$1);
                var self = _hero_mon_obj$14;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1611 = self.kin;
                        var self = _adve_obj$2;
                        switch (self._) {
                            case 'Mons.Object.new':
                                var $1613 = self.kin;
                                var _hero_skill$37 = Mons$Game$get_skills_at$(_code_skill$6, _hero_mon_obj$14);
                                var _adve_skill_code$38 = Mons$Game$adve_turn$(_hero_obj$1, _adve_obj$2, _game$8);
                                var _adve_skill$39 = Mons$Game$get_skills_at$(_adve_skill_code$38, _adve_obj$2);
                                var self = (!Mons$Turn$is_active$(_turn$7));
                                if (self) {
                                    var _game$40 = Mons$Skill$apply_inital_eff$(_hero_idx$4, _adve_idx$5, _pos$3, _game$8);
                                    var self = (_code_skill$6 === 4n);
                                    if (self) {
                                        var _game$41 = Mons$Skill$cast$(_pos$3, _adve_idx$5, _hero_idx$4, _adve_skill$39, _game$40);
                                        var _game$42 = Mons$Skill$cast$(_pos$3, _hero_idx$4, _adve_idx$5, Mons$Skill$run, _game$41);
                                        var _turn$43 = Mons$Turn$new$(Bool$true, Mons$Skill$run, _adve_skill$39, 5);
                                        var $1616 = Mons$Game$set_stt$(Mons$Screen$game$(46, _turn$43), _game$42);
                                        var $1615 = $1616;
                                    } else {
                                        var self = Mons$Game$hero_start_attacking$($1611, $1613);
                                        if (self) {
                                            var _game$41 = Mons$Skill$cast$(_pos$3, _hero_idx$4, _adve_idx$5, _hero_skill$37, _game$40);
                                            var _game$42 = Mons$Skill$cast$(_pos$3, _adve_idx$5, _hero_idx$4, _adve_skill$39, _game$41);
                                            var _turn$43 = Mons$Turn$new$(Bool$true, _hero_skill$37, _adve_skill$39, 2);
                                            var $1618 = Mons$Game$set_stt$(Mons$Screen$game$(46, _turn$43), _game$42);
                                            var $1617 = $1618;
                                        } else {
                                            var _game$41 = Mons$Skill$cast$(_pos$3, _adve_idx$5, _hero_idx$4, _adve_skill$39, _game$40);
                                            var _game$42 = Mons$Skill$cast$(_pos$3, _hero_idx$4, _adve_idx$5, _hero_skill$37, _game$41);
                                            var _turn$43 = Mons$Turn$new$(Bool$false, _hero_skill$37, _adve_skill$39, 2);
                                            var $1619 = Mons$Game$set_stt$(Mons$Screen$game$(46, _turn$43), _game$42);
                                            var $1617 = $1619;
                                        };
                                        var $1615 = $1617;
                                    };
                                    var $1614 = $1615;
                                } else {
                                    var $1620 = _game$8;
                                    var $1614 = $1620;
                                };
                                var $1612 = $1614;
                                break;
                        };
                        var $1610 = $1612;
                        break;
                };
                var $1609 = $1610;
                break;
        };
        return $1609;
    };
    const Mons$Game$exec_turn = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => Mons$Game$exec_turn$(x0, x1, x2, x3, x4, x5, x6, x7);

    function Mons$Kind$is_mon_area$(_adve_kin$1) {
        var self = _adve_kin$1;
        switch (self._) {
            case 'Mons.Kind.Terrain':
                var $1622 = self.ele;
                var self = $1622;
                switch (self._) {
                    case 'Mons.Kind.terrain.VOID':
                    case 'Mons.Kind.terrain.VOID_BLACK':
                    case 'Mons.Kind.terrain.FLOOR':
                    case 'Mons.Kind.terrain.GRASS_PLANT':
                    case 'Mons.Kind.terrain.BUSH':
                    case 'Mons.Kind.terrain.PLANT_0':
                    case 'Mons.Kind.terrain.SAND_0':
                    case 'Mons.Kind.terrain.PATH_BLOCKER':
                    case 'Mons.Kind.terrain.MID_CITY':
                    case 'Mons.Kind.terrain.STAIRS':
                        var $1624 = Bool$false;
                        var $1623 = $1624;
                        break;
                    case 'Mons.Kind.terrain.MON_AREA':
                        var $1625 = Bool$true;
                        var $1623 = $1625;
                        break;
                };
                var $1621 = $1623;
                break;
            case 'Mons.Kind.Mons':
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Interactive':
                var $1626 = Bool$false;
                var $1621 = $1626;
                break;
        };
        return $1621;
    };
    const Mons$Kind$is_mon_area = x0 => Mons$Kind$is_mon_area$(x0);

    function Mons$Kind$area_mon_pos$(_adve_kin$1, _hero_pos$2) {
        var self = _adve_kin$1;
        switch (self._) {
            case 'Mons.Kind.Terrain':
                var $1628 = self.ele;
                var self = $1628;
                switch (self._) {
                    case 'Mons.Kind.terrain.MON_AREA':
                        var $1630 = self.pos_mon;
                        var $1631 = $1630;
                        var $1629 = $1631;
                        break;
                    case 'Mons.Kind.terrain.VOID':
                    case 'Mons.Kind.terrain.VOID_BLACK':
                    case 'Mons.Kind.terrain.FLOOR':
                    case 'Mons.Kind.terrain.GRASS_PLANT':
                    case 'Mons.Kind.terrain.BUSH':
                    case 'Mons.Kind.terrain.PLANT_0':
                    case 'Mons.Kind.terrain.SAND_0':
                    case 'Mons.Kind.terrain.PATH_BLOCKER':
                    case 'Mons.Kind.terrain.MID_CITY':
                    case 'Mons.Kind.terrain.STAIRS':
                        var $1632 = _hero_pos$2;
                        var $1629 = $1632;
                        break;
                };
                var $1627 = $1629;
                break;
            case 'Mons.Kind.Mons':
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Interactive':
                var $1633 = _hero_pos$2;
                var $1627 = $1633;
                break;
        };
        return $1627;
    };
    const Mons$Kind$area_mon_pos = x0 => x1 => Mons$Kind$area_mon_pos$(x0, x1);

    function Mons$Screen$inventory$(_idx$1) {
        var $1634 = ({
            _: 'Mons.Screen.inventory',
            'idx': _idx$1
        });
        return $1634;
    };
    const Mons$Screen$inventory = x0 => Mons$Screen$inventory$(x0);

    function Mons$Skill$clear_after_battle$(_hero_idx$1, _adve_idx$2, _pos$3, _game$4) {
        var self = _game$4;
        switch (self._) {
            case 'Mons.Game.new':
                var $1636 = self.map;
                var _hero_obj$10 = Mons$Map$get$(_pos$3, _hero_idx$1, $1636);
                var _hero_mon_obj$11 = Mons$Object$get_current_mon$(_hero_obj$10);
                var _adve_obj$12 = Mons$Map$get$(_pos$3, _adve_idx$2, $1636);
                var _hero_mon_obj$13 = Mons$Object$set_eff$(Mons$Effect$clear, _hero_mon_obj$11);
                var _game$14 = Mons$Skill$update_mon_obj$(_hero_obj$10, _hero_mon_obj$13, _pos$3, _hero_idx$1, _game$4);
                var _adve_obj$15 = Mons$Object$set_eff$(Mons$Effect$clear, _adve_obj$12);
                var _game$16 = Mons$Skill$update_mon_obj$(_adve_obj$15, _adve_obj$15, _pos$3, _adve_idx$2, _game$14);
                var $1637 = _game$16;
                var $1635 = $1637;
                break;
        };
        return $1635;
    };
    const Mons$Skill$clear_after_battle = x0 => x1 => x2 => x3 => Mons$Skill$clear_after_battle$(x0, x1, x2, x3);

    function Mons$Object$set_cap$(_cap$1, _obj$2) {
        var self = _obj$2;
        switch (self._) {
            case 'Mons.Object.new':
                var $1639 = self.kin;
                var $1640 = self.dir;
                var $1641 = self.pad;
                var $1642 = self.ani;
                var $1643 = self.dmg;
                var $1644 = self.bag;
                var $1645 = self.mon;
                var $1646 = self.bos;
                var $1647 = self.idl;
                var $1648 = self.eff;
                var $1649 = Mons$Object$new$($1639, $1640, $1641, $1642, $1643, $1644, $1645, $1646, _cap$1, $1647, $1648);
                var $1638 = $1649;
                break;
        };
        return $1638;
    };
    const Mons$Object$set_cap = x0 => x1 => Mons$Object$set_cap$(x0, x1);

    function Mons$Object$add_defeated_mon$(_obj$1, _hero$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1651 = self.kin;
                var self = _hero$2;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1653 = self.cap;
                        var self = $1651;
                        switch (self._) {
                            case 'Mons.Kind.Mons':
                                var _qtd_mons$29 = Pair$fst$($1653);
                                var _mons_defeated$30 = Pair$snd$($1653);
                                var _new_cap$31 = Pair$new$(_qtd_mons$29, List$append$(_mons_defeated$30, _obj$1));
                                var $1655 = Mons$Object$set_cap$(_new_cap$31, _hero$2);
                                var $1654 = $1655;
                                break;
                            case 'Mons.Kind.Const':
                            case 'Mons.Kind.Terrain':
                            case 'Mons.Kind.Interactive':
                                var $1656 = _hero$2;
                                var $1654 = $1656;
                                break;
                        };
                        var $1652 = $1654;
                        break;
                };
                var $1650 = $1652;
                break;
        };
        return $1650;
    };
    const Mons$Object$add_defeated_mon = x0 => x1 => Mons$Object$add_defeated_mon$(x0, x1);

    function Mons$Object$set_bos$(_bos$1, _obj$2) {
        var self = _obj$2;
        switch (self._) {
            case 'Mons.Object.new':
                var $1658 = self.kin;
                var $1659 = self.dir;
                var $1660 = self.pad;
                var $1661 = self.ani;
                var $1662 = self.dmg;
                var $1663 = self.bag;
                var $1664 = self.mon;
                var $1665 = self.cap;
                var $1666 = self.idl;
                var $1667 = self.eff;
                var $1668 = Mons$Object$new$($1658, $1659, $1660, $1661, $1662, $1663, $1664, _bos$1, $1665, $1666, $1667);
                var $1657 = $1668;
                break;
        };
        return $1657;
    };
    const Mons$Object$set_bos = x0 => x1 => Mons$Object$set_bos$(x0, x1);

    function Mons$Object$capture_boss$(_boss$1, _hero$2) {
        var self = _boss$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1670 = self.kin;
                var self = _hero$2;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1672 = self.bos;
                        var self = $1670;
                        switch (self._) {
                            case 'Mons.Kind.Mons':
                                var _new_boss_bag$29 = List$append$($1672, _boss$1);
                                var $1674 = Mons$Object$set_bos$(_new_boss_bag$29, _hero$2);
                                var $1673 = $1674;
                                break;
                            case 'Mons.Kind.Const':
                            case 'Mons.Kind.Terrain':
                            case 'Mons.Kind.Interactive':
                                var $1675 = _hero$2;
                                var $1673 = $1675;
                                break;
                        };
                        var $1671 = $1673;
                        break;
                };
                var $1669 = $1671;
                break;
        };
        return $1669;
    };
    const Mons$Object$capture_boss = x0 => x1 => Mons$Object$capture_boss$(x0, x1);

    function Mons$Game$delete_adve_obj$(_adve_obj$1, _hero_obj$2, _pos$3, _hero_idx$4, _adve_idx$5, _game$6) {
        var _game$7 = Mons$Game$map_del$(_pos$3, _adve_idx$5, _game$6);
        var _game$8 = Mons$Game$map_set$(_pos$3, _hero_idx$4, _hero_obj$2, _game$7);
        var $1676 = Mons$Game$set_stt$(Mons$Screen$game$(46, Mons$Turn$empty), _game$8);
        return $1676;
    };
    const Mons$Game$delete_adve_obj = x0 => x1 => x2 => x3 => x4 => x5 => Mons$Game$delete_adve_obj$(x0, x1, x2, x3, x4, x5);

    function Mons$Object$is_full_bag$(_obj$1) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1678 = self.bag;
                var _len$13 = (list_length($1678));
                var $1679 = (_len$13 === 3n);
                var $1677 = $1679;
                break;
        };
        return $1677;
    };
    const Mons$Object$is_full_bag = x0 => Mons$Object$is_full_bag$(x0);

    function Mons$Screen$capture_mon$(_idx$1, _full_bag$2) {
        var $1680 = ({
            _: 'Mons.Screen.capture_mon',
            'idx': _idx$1,
            'full_bag': _full_bag$2
        });
        return $1680;
    };
    const Mons$Screen$capture_mon = x0 => x1 => Mons$Screen$capture_mon$(x0, x1);

    function Mons$Kind$get_pos$(_kin$1) {
        var self = Mons$Kind$attr$(_kin$1);
        switch (self._) {
            case 'Mons.Attr.new':
                var $1682 = self.pos;
                var $1683 = $1682;
                var $1681 = $1683;
                break;
        };
        return $1681;
    };
    const Mons$Kind$get_pos = x0 => Mons$Kind$get_pos$(x0);

    function Mons$Game$add_mon$(_kind_mon$1, _agi$2, _type$3, _game$4) {
        var $1684 = Mons$Game$move_obj$(Mons$global_scr_mid, 0, Mons$Kind$get_pos$(Mons$Kind$Mons$(_kind_mon$1, Bool$false, _type$3, _agi$2)), Mons$Object$new_of_kind$(Mons$Kind$Mons$(_kind_mon$1, Bool$false, _type$3, _agi$2)), _game$4);
        return $1684;
    };
    const Mons$Game$add_mon = x0 => x1 => x2 => x3 => Mons$Game$add_mon$(x0, x1, x2, x3);

    function List$delete_at$(_idx$2, _list$3) {
        var self = _idx$2;
        if (self === 0n) {
            var $1686 = List$tail$(_list$3);
            var $1685 = $1686;
        } else {
            var $1687 = (self - 1n);
            var self = _list$3;
            switch (self._) {
                case 'List.cons':
                    var $1689 = self.head;
                    var $1690 = self.tail;
                    var $1691 = List$cons$($1689, List$delete_at$($1687, $1690));
                    var $1688 = $1691;
                    break;
                case 'List.nil':
                    var $1692 = _list$3;
                    var $1688 = $1692;
                    break;
            };
            var $1685 = $1688;
        };
        return $1685;
    };
    const List$delete_at = x0 => x1 => List$delete_at$(x0, x1);

    function Mons$Object$delete_from_bag$(_idx$1, _hero_obj$2) {
        var _idx_nat$3 = U32$to_nat$(_idx$1);
        var self = _hero_obj$2;
        switch (self._) {
            case 'Mons.Object.new':
                var $1694 = self.bag;
                var _qtd$15 = (list_length($1694));
                var self = (_qtd$15 === 0n);
                if (self) {
                    var $1696 = _hero_obj$2;
                    var $1695 = $1696;
                } else {
                    var _new_bag$16 = List$delete_at$(_idx_nat$3, $1694);
                    var _hero_obj$17 = Mons$Object$set_bag$(_new_bag$16, _hero_obj$2);
                    var $1697 = Mons$Object$set_mon$(0, _hero_obj$17);
                    var $1695 = $1697;
                };
                var $1693 = $1695;
                break;
        };
        return $1693;
    };
    const Mons$Object$delete_from_bag = x0 => x1 => Mons$Object$delete_from_bag$(x0, x1);
    const Mons$Screen$game_over = ({
        _: 'Mons.Screen.game_over'
    });

    function Mons$Turn$is_last_player_move$(_turn$1) {
        var self = _turn$1;
        switch (self._) {
            case 'Mons.Turn.new':
                var $1699 = self.play;
                var $1700 = ($1699 === 1);
                var $1698 = $1700;
                break;
        };
        return $1698;
    };
    const Mons$Turn$is_last_player_move = x0 => Mons$Turn$is_last_player_move$(x0);

    function Mons$Turn$hero_run$(_turn$1) {
        var self = _turn$1;
        switch (self._) {
            case 'Mons.Turn.new':
                var $1702 = self.play;
                var $1703 = ($1702 === 5);
                var $1701 = $1703;
                break;
        };
        return $1701;
    };
    const Mons$Turn$hero_run = x0 => Mons$Turn$hero_run$(x0);

    function Mons$Effect$upd_end_turn_eff$(_eff$1) {
        var self = _eff$1;
        switch (self._) {
            case 'Mons.Effect.new':
                var $1705 = self.sleep;
                var $1706 = self.burn;
                var $1707 = self.protect;
                var $1708 = self.minimize;
                var $1709 = self.invulnerable;
                var $1710 = self.hit;
                var $1711 = self.poison;
                var $1712 = self.swap_agi;
                var _sleep_turn$10 = Pair$fst$($1705);
                var _protect_turn$11 = Pair$fst$($1707);
                var _minimize_turn$12 = Pair$fst$($1708);
                var _invulnerable$13 = Pair$fst$($1709);
                var _update_turn_counter$14 = (_val$14 => {
                    var $1714 = Pair$new$((Math.max(_val$14 - 1, 0)), (_val$14 === 2));
                    return $1714;
                });
                var $1713 = Mons$Effect$new$(_update_turn_counter$14(_sleep_turn$10), $1706, _update_turn_counter$14(_protect_turn$11), _update_turn_counter$14(_minimize_turn$12), (() => {
                    var self = _invulnerable$13;
                    if (self) {
                        var $1715 = Pair$new$(Bool$false, Bool$true);
                        return $1715;
                    } else {
                        var $1716 = Pair$new$(Bool$false, Bool$false);
                        return $1716;
                    };
                })(), $1710, $1711, $1712);
                var $1704 = $1713;
                break;
        };
        return $1704;
    };
    const Mons$Effect$upd_end_turn_eff = x0 => Mons$Effect$upd_end_turn_eff$(x0);

    function Mons$Skill$apply_end_turn_eff$(_hero_idx$1, _adve_idx$2, _pos$3, _game$4) {
        var self = _game$4;
        switch (self._) {
            case 'Mons.Game.new':
                var $1718 = self.map;
                var _hero_obj$10 = Mons$Map$get$(_pos$3, _hero_idx$1, $1718);
                var _hero_mon_obj$11 = Mons$Object$get_current_mon$(_hero_obj$10);
                var _adve_obj$12 = Mons$Map$get$(_pos$3, _adve_idx$2, $1718);
                var self = _hero_mon_obj$11;
                switch (self._) {
                    case 'Mons.Object.new':
                        var $1720 = self.eff;
                        var _eff_upd$24 = Mons$Effect$upd_end_turn_eff$($1720);
                        var _hero_mon_obj$25 = Mons$Object$set_eff$(_eff_upd$24, _hero_mon_obj$11);
                        var _game$26 = Mons$Skill$update_mon_obj$(_hero_obj$10, _hero_mon_obj$25, _pos$3, _hero_idx$1, _game$4);
                        var self = _adve_obj$12;
                        switch (self._) {
                            case 'Mons.Object.new':
                                var $1722 = self.eff;
                                var _upd_effect$38 = Mons$Effect$upd_end_turn_eff$($1722);
                                var _adve_obj$39 = Mons$Object$set_eff$(_upd_effect$38, _adve_obj$12);
                                var _game$40 = Mons$Game$map_set$(_pos$3, _adve_idx$2, _adve_obj$39, _game$26);
                                var $1723 = _game$40;
                                var $1721 = $1723;
                                break;
                        };
                        var $1719 = $1721;
                        break;
                };
                var $1717 = $1719;
                break;
        };
        return $1717;
    };
    const Mons$Skill$apply_end_turn_eff = x0 => x1 => x2 => x3 => Mons$Skill$apply_end_turn_eff$(x0, x1, x2, x3);

    function Mons$Game$move_hero_down$(_usr$1, _hero_obj$2, _pos$3, _hero_idx$4, _game$5) {
        var _y$6 = (((_pos$3 >>> 12) & 0xFFF));
        var _x$7 = ((_pos$3 & 0xFFF));
        var _z$8 = ((_pos$3 >>> 24));
        var _new_pos$9 = ((0 | _x$7 | (((_y$6 + 1) >>> 0) << 12) | (_z$8 << 24)));
        var _game$10 = Mons$Game$move_obj$(_pos$3, _hero_idx$4, _new_pos$9, _hero_obj$2, _game$5);
        var $1724 = Mons$Game$set_user_pos$(_usr$1, _new_pos$9, _game$10);
        return $1724;
    };
    const Mons$Game$move_hero_down = x0 => x1 => x2 => x3 => x4 => Mons$Game$move_hero_down$(x0, x1, x2, x3, x4);
    const Mons$Kind$mons$ZOIO = ({
        _: 'Mons.Kind.mons.ZOIO'
    });
    const Mons$Kind$mons$MIMIC = ({
        _: 'Mons.Kind.mons.MIMIC'
    });
    const Mons$Kind$mons$MIMIC2 = ({
        _: 'Mons.Kind.mons.MIMIC2'
    });
    const Mons$Kind$mons$CYCLOPE = ({
        _: 'Mons.Kind.mons.CYCLOPE'
    });
    const Mons$Kind$mons$TROWL = ({
        _: 'Mons.Kind.mons.TROWL'
    });
    const Mons$Kind$mons$EMERELDER2 = ({
        _: 'Mons.Kind.mons.EMERELDER2'
    });

    function Mons$Game$add_boss$(_kind_mon$1, _agi$2, _type$3, _game$4) {
        var $1725 = Mons$Game$move_obj$(Mons$global_scr_mid, 0, Mons$Kind$get_pos$(Mons$Kind$Mons$(_kind_mon$1, Bool$true, _type$3, _agi$2)), Mons$Object$new_of_kind$(Mons$Kind$Mons$(_kind_mon$1, Bool$true, _type$3, _agi$2)), _game$4);
        return $1725;
    };
    const Mons$Game$add_boss = x0 => x1 => x2 => x3 => Mons$Game$add_boss$(x0, x1, x2, x3);
    const Mons$Kind$mons$BEHOLDER = ({
        _: 'Mons.Kind.mons.BEHOLDER'
    });

    function Mons$Game$add_mons_to_map$(_pos$1, _game$2) {
        var _lvl$3 = ((_pos$1 >>> 24));
        var self = (_lvl$3 === 1);
        if (self) {
            var _type$4 = Mons$Type$normal;
            var _game$5 = Mons$Game$add_mon$(Mons$Kind$mons$ZOIO, 2, _type$4, _game$2);
            var _game$6 = Mons$Game$add_mon$(Mons$Kind$mons$MIMIC, 0, _type$4, _game$5);
            var _game$7 = Mons$Game$add_mon$(Mons$Kind$mons$MIMIC2, 0, _type$4, _game$6);
            var _game$8 = Mons$Game$add_mon$(Mons$Kind$mons$POISOLICK, 2, _type$4, _game$7);
            var _game$9 = Mons$Game$add_mon$(Mons$Kind$mons$AZULA, 1, _type$4, _game$8);
            var _game$10 = Mons$Game$add_mon$(Mons$Kind$mons$CYCLOPE, 2, _type$4, _game$9);
            var _game$11 = Mons$Game$add_mon$(Mons$Kind$mons$TROWL, 0, _type$4, _game$10);
            var _game$12 = Mons$Game$add_mon$(Mons$Kind$mons$EMERELDER, 2, _type$4, _game$11);
            var _game$13 = Mons$Game$add_mon$(Mons$Kind$mons$EMERELDER2, 2, _type$4, _game$12);
            var $1727 = _game$13;
            var $1726 = $1727;
        } else {
            var self = (_lvl$3 === 2);
            if (self) {
                var $1729 = Mons$Game$add_boss$(Mons$Kind$mons$BEHOLDER, 2, Mons$Type$normal, _game$2);
                var $1728 = $1729;
            } else {
                var $1730 = _game$2;
                var $1728 = $1730;
            };
            var $1726 = $1728;
        };
        return $1726;
    };
    const Mons$Game$add_mons_to_map = x0 => x1 => Mons$Game$add_mons_to_map$(x0, x1);

    function Mons$Game$hero_inital_position$(_usr$1, _hero_obj$2, _pos$3, _hero_idx$4, _game$5) {
        var _x$6 = ((Mons$global_scr_mid & 0xFFF));
        var _y$7 = (((Mons$global_scr_mid >>> 12) & 0xFFF));
        var _z$8 = ((_pos$3 >>> 24));
        var self = (_z$8 === 0);
        if (self) {
            var _new_pos$9 = ((0 | _x$6 | (((_y$7 + 12) >>> 0) << 12) | (0 << 24)));
            var _game$10 = Mons$Game$move_obj$(_pos$3, _hero_idx$4, _new_pos$9, _hero_obj$2, _game$5);
            var $1732 = Mons$Game$set_user_pos$(_usr$1, _new_pos$9, _game$10);
            var $1731 = $1732;
        } else {
            var self = (_z$8 === 1);
            if (self) {
                var $1734 = ((0 | _x$6 | (((_y$7 + 38) >>> 0) << 12) | (1 << 24)));
                var _new_pos$9 = $1734;
            } else {
                var self = (_z$8 === 2);
                if (self) {
                    var $1736 = ((0 | _x$6 | (((_y$7 + 5) >>> 0) << 12) | (2 << 24)));
                    var $1735 = $1736;
                } else {
                    var $1737 = _pos$3;
                    var $1735 = $1737;
                };
                var _new_pos$9 = $1735;
            };
            var _game$10 = Mons$Game$move_obj$(Mons$global_scr_mid, _hero_idx$4, _new_pos$9, _hero_obj$2, _game$5);
            var _game$11 = Mons$Game$set_user_pos$(_usr$1, _new_pos$9, _game$10);
            var $1733 = Mons$Game$add_mons_to_map$(_new_pos$9, _game$11);
            var $1731 = $1733;
        };
        return $1731;
    };
    const Mons$Game$hero_inital_position = x0 => x1 => x2 => x3 => x4 => Mons$Game$hero_inital_position$(x0, x1, x2, x3, x4);

    function Mons$Object$get_adjacent_obj$(_pos$1, _dir$2, _map$3) {
        var _adjacent_pos$4 = Mons$Object$get_adjacent_pos$(_pos$1, _dir$2, _map$3);
        var $1738 = Mons$Map$get_top$(_adjacent_pos$4, _map$3);
        return $1738;
    };
    const Mons$Object$get_adjacent_obj = x0 => x1 => x2 => Mons$Object$get_adjacent_obj$(x0, x1, x2);

    function Mons$Object$hero_can_push_obj$(_pos$1, _dir$2, _map$3) {
        var self = Mons$Object$get_adjacent_obj$(_pos$1, _dir$2, _map$3);
        switch (self._) {
            case 'Mons.Object.new':
                var $1740 = self.kin;
                var self = $1740;
                switch (self._) {
                    case 'Mons.Kind.Interactive':
                        var $1742 = self.ele;
                        var self = $1742;
                        switch (self._) {
                            case 'Mons.Kind.inter.LEVER':
                            case 'Mons.Kind.inter.MOVE':
                                var $1744 = Bool$true;
                                var $1743 = $1744;
                                break;
                            case 'Mons.Kind.inter.HEAL':
                                var $1745 = Bool$false;
                                var $1743 = $1745;
                                break;
                        };
                        var $1741 = $1743;
                        break;
                    case 'Mons.Kind.Mons':
                    case 'Mons.Kind.Const':
                    case 'Mons.Kind.Terrain':
                        var $1746 = Bool$false;
                        var $1741 = $1746;
                        break;
                };
                var $1739 = $1741;
                break;
        };
        return $1739;
    };
    const Mons$Object$hero_can_push_obj = x0 => x1 => x2 => Mons$Object$hero_can_push_obj$(x0, x1, x2);

    function Mons$Kind$exec_eff$(_kind$1, _game$2) {
        var self = _kind$1;
        switch (self._) {
            case 'Mons.Kind.Interactive':
                var $1748 = self.ele;
                var $1749 = self.on;
                var $1750 = self.eff;
                var $1751 = $1750($1748)($1749)(_game$2);
                var $1747 = $1751;
                break;
            case 'Mons.Kind.Mons':
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Terrain':
                var $1752 = _game$2;
                var $1747 = $1752;
                break;
        };
        return $1747;
    };
    const Mons$Kind$exec_eff = x0 => x1 => Mons$Kind$exec_eff$(x0, x1);

    function Mons$Object$set_kin$(_obj$1, _kin$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1754 = self.dir;
                var $1755 = self.pad;
                var $1756 = self.ani;
                var $1757 = self.dmg;
                var $1758 = self.bag;
                var $1759 = self.mon;
                var $1760 = self.bos;
                var $1761 = self.cap;
                var $1762 = self.idl;
                var $1763 = self.eff;
                var $1764 = Mons$Object$new$(_kin$2, $1754, $1755, $1756, $1757, $1758, $1759, $1760, $1761, $1762, $1763);
                var $1753 = $1764;
                break;
        };
        return $1753;
    };
    const Mons$Object$set_kin = x0 => x1 => Mons$Object$set_kin$(x0, x1);

    function Mons$Object$update_interactive$(_obj$1, _fun$2) {
        var self = _obj$1;
        switch (self._) {
            case 'Mons.Object.new':
                var $1766 = self.kin;
                var $1767 = Mons$Object$set_kin$(_obj$1, _fun$2($1766));
                var $1765 = $1767;
                break;
        };
        return $1765;
    };
    const Mons$Object$update_interactive = x0 => x1 => Mons$Object$update_interactive$(x0, x1);

    function Mons$Kind$set_on_interactive$(_kind$1) {
        var self = _kind$1;
        switch (self._) {
            case 'Mons.Kind.Interactive':
                var $1769 = self.ele;
                var $1770 = self.eff;
                var $1771 = Mons$Kind$Interactive$($1769, Bool$true, $1770);
                var $1768 = $1771;
                break;
            case 'Mons.Kind.Mons':
            case 'Mons.Kind.Const':
            case 'Mons.Kind.Terrain':
                var $1772 = _kind$1;
                var $1768 = $1772;
                break;
        };
        return $1768;
    };
    const Mons$Kind$set_on_interactive = x0 => Mons$Kind$set_on_interactive$(x0);

    function Mons$Game$cmd$(_cmd$1, _usr$2, _game$3) {
        var _pos$4 = Mons$Game$get_user_pos$(_usr$2, _game$3);
        var _set_stt_game$5 = (_game$5 => {
            var $1774 = Mons$Game$set_stt$(Mons$Screen$game$(46, Mons$Turn$empty), _game$5);
            return $1774;
        });
        var self = _pos$4;
        switch (self._) {
            case 'Maybe.some':
                var $1775 = self.value;
                var self = _game$3;
                switch (self._) {
                    case 'Mons.Game.new':
                        var $1777 = self.usr;
                        var $1778 = self.map;
                        var $1779 = self.stt;
                        var _pos$12 = $1775;
                        var _hero_pair$13 = Mons$Map$get_hero$(_pos$12, $1778);
                        var _hero_obj$14 = Pair$fst$(_hero_pair$13);
                        var _hero_idx$15 = Pair$snd$(_hero_pair$13);
                        var _adve_idx$16 = 1;
                        var _adve_obj$17 = Mons$Map$get$(_pos$12, _adve_idx$16, $1778);
                        var _is_battling$18 = Mons$Object$is_battling$(_adve_obj$17, _hero_obj$14);
                        var _end_battle$19 = Mons$Object$ended_battle$(_adve_obj$17, _hero_obj$14);
                        var _curr_mon$20 = Mons$Object$get_current_mon$(_hero_obj$14);
                        var self = _curr_mon$20;
                        switch (self._) {
                            case 'Mons.Object.new':
                                var $1781 = self.kin;
                                var _skills$32 = Mons$Kind$get_skills$($1781);
                                var self = _hero_obj$14;
                                switch (self._) {
                                    case 'Mons.Object.new':
                                        var $1783 = self.dir;
                                        var $1784 = self.ani;
                                        var $1785 = self.bag;
                                        var $1786 = self.mon;
                                        var self = _adve_obj$17;
                                        switch (self._) {
                                            case 'Mons.Object.new':
                                                var $1788 = self.kin;
                                                var self = $1779;
                                                switch (self._) {
                                                    case 'Mons.Screen.welcome':
                                                        var $1790 = self.idx;
                                                        var self = ((_cmd$1 === 99) || (_cmd$1 === 67));
                                                        if (self) {
                                                            var self = ($1790 === 0);
                                                            if (self) {
                                                                var $1793 = Mons$Game$set_stt$(Mons$Screen$introduction$(0), _game$3);
                                                                var $1792 = $1793;
                                                            } else {
                                                                var $1794 = Mons$Game$set_stt$(Mons$Screen$credits, _game$3);
                                                                var $1792 = $1794;
                                                            };
                                                            var $1791 = $1792;
                                                        } else {
                                                            var self = ((_cmd$1 === 119) || (_cmd$1 === 87));
                                                            if (self) {
                                                                var $1796 = Mons$Game$set_stt$(Mons$Screen$welcome$(0), _game$3);
                                                                var $1795 = $1796;
                                                            } else {
                                                                var self = ((_cmd$1 === 115) || (_cmd$1 === 83));
                                                                if (self) {
                                                                    var $1798 = Mons$Game$set_stt$(Mons$Screen$welcome$(1), _game$3);
                                                                    var $1797 = $1798;
                                                                } else {
                                                                    var $1799 = _game$3;
                                                                    var $1797 = $1799;
                                                                };
                                                                var $1795 = $1797;
                                                            };
                                                            var $1791 = $1795;
                                                        };
                                                        var $1789 = $1791;
                                                        break;
                                                    case 'Mons.Screen.introduction':
                                                        var $1800 = self.step;
                                                        var _can_walk$56 = ($1800 === 0);
                                                        var self = (_can_walk$56 && Mons$is_walk_cmd$(_cmd$1));
                                                        if (self) {
                                                            var $1802 = Mons$Game$walk$(_cmd$1, _pos$12, _hero_idx$15, _game$3);
                                                            var $1801 = $1802;
                                                        } else {
                                                            var self = ((_cmd$1 === 99) && Mons$Kind$is_mage$($1788));
                                                            if (self) {
                                                                var self = ($1800 === 0);
                                                                if (self) {
                                                                    var _game$57 = Mons$initial_mons$(_hero_obj$14, _pos$12, 0, _game$3);
                                                                    var $1805 = Mons$Game$set_stt$(Mons$Screen$introduction$(1), _game$57);
                                                                    var $1804 = $1805;
                                                                } else {
                                                                    var self = ($1800 === 1);
                                                                    if (self) {
                                                                        var $1807 = Mons$Game$set_stt$(Mons$Screen$intro_select$(0), _game$3);
                                                                        var $1806 = $1807;
                                                                    } else {
                                                                        var self = ($1800 === 2);
                                                                        if (self) {
                                                                            var _game$57 = Mons$Game$map_del$(_pos$12, _adve_idx$16, _game$3);
                                                                            var _hero_obj$58 = Mons$Object$delete_init_mons$(_hero_obj$14);
                                                                            var _game$59 = Mons$Game$map_set$(_pos$12, _hero_idx$15, _hero_obj$58, _game$57);
                                                                            var $1809 = Mons$Game$set_stt$(Mons$Screen$game$(46, Mons$Turn$empty), _game$59);
                                                                            var $1808 = $1809;
                                                                        } else {
                                                                            var $1810 = Mons$Game$set_stt$(Mons$Screen$game$(46, Mons$Turn$empty), _game$3);
                                                                            var $1808 = $1810;
                                                                        };
                                                                        var $1806 = $1808;
                                                                    };
                                                                    var $1804 = $1806;
                                                                };
                                                                var $1803 = $1804;
                                                            } else {
                                                                var $1811 = _game$3;
                                                                var $1803 = $1811;
                                                            };
                                                            var $1801 = $1803;
                                                        };
                                                        var $1789 = $1801;
                                                        break;
                                                    case 'Mons.Screen.game':
                                                        var $1812 = self.turn;
                                                        var self = (_cmd$1 === 85);
                                                        if (self) {
                                                            var $1814 = Mons$Game$exec_turn$(_hero_obj$14, _adve_obj$17, _pos$12, _hero_idx$15, _adve_idx$16, 0n, $1812, _game$3);
                                                            var $1813 = $1814;
                                                        } else {
                                                            var self = (_cmd$1 === 73);
                                                            if (self) {
                                                                var $1816 = Mons$Game$exec_turn$(_hero_obj$14, _adve_obj$17, _pos$12, _hero_idx$15, _adve_idx$16, 1n, $1812, _game$3);
                                                                var $1815 = $1816;
                                                            } else {
                                                                var self = (_cmd$1 === 74);
                                                                if (self) {
                                                                    var $1818 = Mons$Game$exec_turn$(_hero_obj$14, _adve_obj$17, _pos$12, _hero_idx$15, _adve_idx$16, 2n, $1812, _game$3);
                                                                    var $1817 = $1818;
                                                                } else {
                                                                    var self = (_cmd$1 === 75);
                                                                    if (self) {
                                                                        var $1820 = Mons$Game$exec_turn$(_hero_obj$14, _adve_obj$17, _pos$12, _hero_idx$15, _adve_idx$16, 3n, $1812, _game$3);
                                                                        var $1819 = $1820;
                                                                    } else {
                                                                        var self = (_cmd$1 === 82);
                                                                        if (self) {
                                                                            var $1822 = Mons$Game$exec_turn$(_hero_obj$14, _adve_obj$17, _pos$12, _hero_idx$15, _adve_idx$16, 4n, $1812, _game$3);
                                                                            var $1821 = $1822;
                                                                        } else {
                                                                            var self = Mons$is_walk_cmd$(_cmd$1);
                                                                            if (self) {
                                                                                var self = Mons$Kind$is_mon_area$($1788);
                                                                                if (self) {
                                                                                    var _adve_pos$57 = Mons$Kind$area_mon_pos$($1788, _pos$12);
                                                                                    var _mon_area_obj$58 = Mons$Map$get$(_adve_pos$57, 0, $1778);
                                                                                    var self = _mon_area_obj$58;
                                                                                    switch (self._) {
                                                                                        case 'Mons.Object.new':
                                                                                            var $1826 = self.kin;
                                                                                            var self = $1826;
                                                                                            switch (self._) {
                                                                                                case 'Mons.Kind.Mons':
                                                                                                    var _game$74 = Mons$Game$walk$(_cmd$1, _pos$12, _hero_idx$15, _game$3);
                                                                                                    var self = ($1784 === 0);
                                                                                                    if (self) {
                                                                                                        var _game$75 = Mons$Game$move_obj$(_adve_pos$57, 0, _pos$12, _mon_area_obj$58, _game$74);
                                                                                                        var _game$76 = Mons$Game$move_obj$(_pos$12, 1, _pos$12, _hero_obj$14, _game$75);
                                                                                                        var $1829 = Mons$Game$set_user_pos$($1777, _pos$12, _game$76);
                                                                                                        var $1828 = $1829;
                                                                                                    } else {
                                                                                                        var $1830 = _game$74;
                                                                                                        var $1828 = $1830;
                                                                                                    };
                                                                                                    var $1827 = $1828;
                                                                                                    break;
                                                                                                case 'Mons.Kind.Const':
                                                                                                case 'Mons.Kind.Terrain':
                                                                                                case 'Mons.Kind.Interactive':
                                                                                                    var $1831 = Mons$Game$walk$(_cmd$1, _pos$12, _hero_idx$15, _game$3);
                                                                                                    var $1827 = $1831;
                                                                                                    break;
                                                                                            };
                                                                                            var $1825 = $1827;
                                                                                            break;
                                                                                    };
                                                                                    var $1824 = $1825;
                                                                                } else {
                                                                                    var self = (Mons$Object$is_battling$(_adve_obj$17, _hero_obj$14) && (!Mons$Kind$is_mage$($1788)));
                                                                                    if (self) {
                                                                                        var self = ($1784 === 0);
                                                                                        if (self) {
                                                                                            var $1834 = Mons$Game$move_obj$(_pos$12, 0, _pos$12, _hero_obj$14, _game$3);
                                                                                            var $1833 = $1834;
                                                                                        } else {
                                                                                            var $1835 = Mons$Game$walk$(_cmd$1, _pos$12, _hero_idx$15, _game$3);
                                                                                            var $1833 = $1835;
                                                                                        };
                                                                                        var $1832 = $1833;
                                                                                    } else {
                                                                                        var $1836 = Mons$Game$walk$(_cmd$1, _pos$12, _hero_idx$15, _game$3);
                                                                                        var $1832 = $1836;
                                                                                    };
                                                                                    var $1824 = $1832;
                                                                                };
                                                                                var $1823 = $1824;
                                                                            } else {
                                                                                var self = (_cmd$1 === 101);
                                                                                if (self) {
                                                                                    var self = (_is_battling$18 || _end_battle$19);
                                                                                    if (self) {
                                                                                        var $1839 = _game$3;
                                                                                        var $1838 = $1839;
                                                                                    } else {
                                                                                        var $1840 = Mons$Game$set_stt$(Mons$Screen$inventory$(0), _game$3);
                                                                                        var $1838 = $1840;
                                                                                    };
                                                                                    var $1837 = $1838;
                                                                                } else {
                                                                                    var self = (_cmd$1 === 99);
                                                                                    if (self) {
                                                                                        var self = $1788;
                                                                                        switch (self._) {
                                                                                            case 'Mons.Kind.Mons':
                                                                                                var $1843 = self.ele;
                                                                                                var $1844 = self.boss;
                                                                                                var $1845 = self.pri_type;
                                                                                                var $1846 = self.agi;
                                                                                                var self = Mons$Object$is_obj_defeated$(_adve_obj$17);
                                                                                                if (self) {
                                                                                                    var _game$61 = Mons$Skill$clear_after_battle$(_hero_idx$15, _adve_idx$16, _pos$12, _game$3);
                                                                                                    var _hero_obj$62 = Mons$Object$add_defeated_mon$(_adve_obj$17, _hero_obj$14);
                                                                                                    var self = $1844;
                                                                                                    if (self) {
                                                                                                        var _hero_obj$63 = Mons$Object$capture_boss$(_adve_obj$17, _hero_obj$62);
                                                                                                        var $1849 = Mons$Game$delete_adve_obj$(_adve_obj$17, _hero_obj$63, _pos$12, _hero_idx$15, _adve_idx$16, _game$61);
                                                                                                        var $1848 = $1849;
                                                                                                    } else {
                                                                                                        var self = Mons$Object$is_full_bag$(_hero_obj$62);
                                                                                                        if (self) {
                                                                                                            var _game$63 = Mons$Game$map_set$(_pos$12, _hero_idx$15, _hero_obj$62, _game$61);
                                                                                                            var $1851 = Mons$Game$set_stt$(Mons$Screen$capture_mon$(0, Bool$true), _game$63);
                                                                                                            var $1850 = $1851;
                                                                                                        } else {
                                                                                                            var _adve_obj$63 = Mons$Object$set_eff$(Mons$Effect$clear, _adve_obj$17);
                                                                                                            var _hero_obj$64 = Mons$Object$push_to_bag$(_adve_obj$63, _hero_obj$62);
                                                                                                            var $1852 = Mons$Game$delete_adve_obj$(_adve_obj$63, _hero_obj$64, _pos$12, _hero_idx$15, _adve_idx$16, _game$61);
                                                                                                            var $1850 = $1852;
                                                                                                        };
                                                                                                        var $1848 = $1850;
                                                                                                    };
                                                                                                    var $1847 = $1848;
                                                                                                } else {
                                                                                                    var self = Mons$Object$is_obj_defeated$(_curr_mon$20);
                                                                                                    if (self) {
                                                                                                        var _game$61 = Mons$Skill$clear_after_battle$(_hero_idx$15, _adve_idx$16, _pos$12, _game$3);
                                                                                                        var _game$62 = Mons$Game$add_mon$($1843, $1846, $1845, _game$61);
                                                                                                        var _hero_obj$63 = Mons$Object$delete_from_bag$($1786, _hero_obj$14);
                                                                                                        var _game$64 = Mons$Game$map_set$(_pos$12, _hero_idx$15, _hero_obj$63, _game$62);
                                                                                                        var self = ((list_length($1785)) === 0n);
                                                                                                        if (self) {
                                                                                                            var $1855 = Mons$Game$set_stt$(Mons$Screen$game_over, _game$64);
                                                                                                            var $1854 = $1855;
                                                                                                        } else {
                                                                                                            var _game$65 = Mons$Game$delete_adve_obj$(_adve_obj$17, _hero_obj$63, _pos$12, _hero_idx$15, _adve_idx$16, _game$64);
                                                                                                            var $1856 = _set_stt_game$5(_game$65);
                                                                                                            var $1854 = $1856;
                                                                                                        };
                                                                                                        var $1853 = $1854;
                                                                                                    } else {
                                                                                                        var self = $1812;
                                                                                                        switch (self._) {
                                                                                                            case 'Mons.Turn.new':
                                                                                                                var $1858 = self.exec_hero;
                                                                                                                var $1859 = self.hero_skill;
                                                                                                                var $1860 = self.adve_skill;
                                                                                                                var $1861 = self.play;
                                                                                                                var self = Mons$Turn$is_active$($1812);
                                                                                                                if (self) {
                                                                                                                    var self = (Mons$Turn$is_last_player_move$($1812) || Mons$Turn$hero_run$($1812));
                                                                                                                    if (self) {
                                                                                                                        var _game$65 = Mons$Skill$apply_end_turn_eff$(_hero_idx$15, _adve_idx$16, _pos$12, _game$3);
                                                                                                                        var self = Mons$Turn$hero_run$($1812);
                                                                                                                        if (self) {
                                                                                                                            var _game$66 = Mons$Skill$clear_after_battle$(_hero_idx$15, _adve_idx$16, _pos$12, _game$65);
                                                                                                                            var _game$67 = Mons$Game$move_obj$(_pos$12, _adve_idx$16, Mons$Kind$get_pos$($1788), _adve_obj$17, _game$66);
                                                                                                                            var _game$68 = Mons$Game$move_hero_down$($1777, _hero_obj$14, _pos$12, _hero_idx$15, _game$67);
                                                                                                                            var $1865 = _set_stt_game$5(_game$68);
                                                                                                                            var $1864 = $1865;
                                                                                                                        } else {
                                                                                                                            var $1866 = _set_stt_game$5(_game$65);
                                                                                                                            var $1864 = $1866;
                                                                                                                        };
                                                                                                                        var $1863 = $1864;
                                                                                                                    } else {
                                                                                                                        var _turn$65 = Mons$Turn$new$((!$1858), $1859, $1860, (Math.max($1861 - 1, 0)));
                                                                                                                        var $1867 = Mons$Game$set_stt$(Mons$Screen$game$(46, _turn$65), _game$3);
                                                                                                                        var $1863 = $1867;
                                                                                                                    };
                                                                                                                    var $1862 = $1863;
                                                                                                                } else {
                                                                                                                    var $1868 = _set_stt_game$5(_game$3);
                                                                                                                    var $1862 = $1868;
                                                                                                                };
                                                                                                                var $1857 = $1862;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1853 = $1857;
                                                                                                    };
                                                                                                    var $1847 = $1853;
                                                                                                };
                                                                                                var $1842 = $1847;
                                                                                                break;
                                                                                            case 'Mons.Kind.Interactive':
                                                                                                var $1869 = self.ele;
                                                                                                var _inter_obj$60 = Mons$Object$update_interactive$(_adve_obj$17, Mons$Kind$set_on_interactive);
                                                                                                var _game$61 = Mons$Game$map_set$(_pos$12, _adve_idx$16, _inter_obj$60, _game$3);
                                                                                                var self = _inter_obj$60;
                                                                                                switch (self._) {
                                                                                                    case 'Mons.Object.new':
                                                                                                        var $1871 = self.kin;
                                                                                                        var $1872 = Mons$Kind$exec_eff$($1871, _game$61);
                                                                                                        var _game_eff_after_interact$60 = $1872;
                                                                                                        break;
                                                                                                };
                                                                                                var self = $1869;
                                                                                                switch (self._) {
                                                                                                    case 'Mons.Kind.inter.LEVER':
                                                                                                    case 'Mons.Kind.inter.MOVE':
                                                                                                        var $1873 = _game_eff_after_interact$60;
                                                                                                        var $1870 = $1873;
                                                                                                        break;
                                                                                                    case 'Mons.Kind.inter.HEAL':
                                                                                                        var _game$61 = Mons$Kind$exec_eff$($1788, _game$3);
                                                                                                        var _inter_obj$62 = Mons$Object$update_interactive$(_adve_obj$17, Mons$Kind$set_on_interactive);
                                                                                                        var $1874 = Mons$Game$map_set$(_pos$12, _adve_idx$16, _inter_obj$62, _game$61);
                                                                                                        var $1870 = $1874;
                                                                                                        break;
                                                                                                };
                                                                                                var $1842 = $1870;
                                                                                                break;
                                                                                            case 'Mons.Kind.Const':
                                                                                                var self = Mons$Kind$is_portal$($1788);
                                                                                                if (self) {
                                                                                                    var _new_pos$58 = Pos32$add$(_pos$12, ((0 | 0 | (0 << 12) | (1 << 24))));
                                                                                                    var $1876 = Mons$Game$hero_inital_position$(_usr$2, _hero_obj$14, _new_pos$58, _hero_idx$15, _game$3);
                                                                                                    var $1875 = $1876;
                                                                                                } else {
                                                                                                    var $1877 = _game$3;
                                                                                                    var $1875 = $1877;
                                                                                                };
                                                                                                var $1842 = $1875;
                                                                                                break;
                                                                                            case 'Mons.Kind.Terrain':
                                                                                                var self = Mons$Object$hero_can_push_obj$(_pos$12, $1783, $1778);
                                                                                                if (self) {
                                                                                                    var _adjacent_obj$58 = Mons$Object$get_adjacent_obj$(_pos$12, $1783, $1778);
                                                                                                    var self = _adjacent_obj$58;
                                                                                                    switch (self._) {
                                                                                                        case 'Mons.Object.new':
                                                                                                            var $1880 = self.kin;
                                                                                                            var $1881 = Mons$Kind$exec_eff$($1880, _game$3);
                                                                                                            var $1879 = $1881;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1878 = $1879;
                                                                                                } else {
                                                                                                    var $1882 = _set_stt_game$5(_game$3);
                                                                                                    var $1878 = $1882;
                                                                                                };
                                                                                                var $1842 = $1878;
                                                                                                break;
                                                                                        };
                                                                                        var $1841 = $1842;
                                                                                    } else {
                                                                                        var self = (_cmd$1 === 122);
                                                                                        if (self) {
                                                                                            var self = $1788;
                                                                                            switch (self._) {
                                                                                                case 'Mons.Kind.Mons':
                                                                                                    var self = Mons$Object$is_obj_defeated$(_adve_obj$17);
                                                                                                    if (self) {
                                                                                                        var _hero_obj$61 = Mons$Object$add_defeated_mon$(_adve_obj$17, _hero_obj$14);
                                                                                                        var _game$62 = Mons$Game$map_del$(_pos$12, _adve_idx$16, _game$3);
                                                                                                        var _game$63 = Mons$Game$map_set$(_pos$12, _hero_idx$15, _hero_obj$61, _game$62);
                                                                                                        var $1886 = _set_stt_game$5(_game$63);
                                                                                                        var $1885 = $1886;
                                                                                                    } else {
                                                                                                        var $1887 = _game$3;
                                                                                                        var $1885 = $1887;
                                                                                                    };
                                                                                                    var $1884 = $1885;
                                                                                                    break;
                                                                                                case 'Mons.Kind.Const':
                                                                                                case 'Mons.Kind.Terrain':
                                                                                                case 'Mons.Kind.Interactive':
                                                                                                    var $1888 = _set_stt_game$5(_game$3);
                                                                                                    var $1884 = $1888;
                                                                                                    break;
                                                                                            };
                                                                                            var $1883 = $1884;
                                                                                        } else {
                                                                                            var $1889 = _game$3;
                                                                                            var $1883 = $1889;
                                                                                        };
                                                                                        var $1841 = $1883;
                                                                                    };
                                                                                    var $1837 = $1841;
                                                                                };
                                                                                var $1823 = $1837;
                                                                            };
                                                                            var $1821 = $1823;
                                                                        };
                                                                        var $1819 = $1821;
                                                                    };
                                                                    var $1817 = $1819;
                                                                };
                                                                var $1815 = $1817;
                                                            };
                                                            var $1813 = $1815;
                                                        };
                                                        var $1789 = $1813;
                                                        break;
                                                    case 'Mons.Screen.credits':
                                                        var self = ((_cmd$1 === 122) || (_cmd$1 === 90));
                                                        if (self) {
                                                            var $1891 = Mons$Game$set_stt$(Mons$Screen$welcome$(0), _game$3);
                                                            var $1890 = $1891;
                                                        } else {
                                                            var $1892 = _game$3;
                                                            var $1890 = $1892;
                                                        };
                                                        var $1789 = $1890;
                                                        break;
                                                    case 'Mons.Screen.intro_select':
                                                        var self = (_cmd$1 === 99);
                                                        if (self) {
                                                            var $1894 = Mons$Game$set_stt$(Mons$Screen$introduction$(2), _game$3);
                                                            var $1893 = $1894;
                                                        } else {
                                                            var $1895 = _game$3;
                                                            var $1893 = $1895;
                                                        };
                                                        var $1789 = $1893;
                                                        break;
                                                    case 'Mons.Screen.inventory':
                                                    case 'Mons.Screen.game_over':
                                                        var $1896 = _game$3;
                                                        var $1789 = $1896;
                                                        break;
                                                    case 'Mons.Screen.capture_mon':
                                                        var self = (_cmd$1 === 99);
                                                        if (self) {
                                                            var _hero_obj$57 = Mons$Object$delete_from_bag$($1786, _hero_obj$14);
                                                            var _hero_obj$58 = Mons$Object$push_to_bag$(_adve_obj$17, _hero_obj$57);
                                                            var _hero_obj$59 = Mons$Object$set_mon$(2, _hero_obj$58);
                                                            var _game$60 = Mons$Game$map_del$(_pos$12, _adve_idx$16, _game$3);
                                                            var _game$61 = Mons$Game$map_set$(_pos$12, _hero_idx$15, _hero_obj$59, _game$60);
                                                            var $1898 = _set_stt_game$5(_game$61);
                                                            var $1897 = $1898;
                                                        } else {
                                                            var self = (_cmd$1 === 122);
                                                            if (self) {
                                                                var self = Mons$Object$is_obj_defeated$(_adve_obj$17);
                                                                if (self) {
                                                                    var _game$57 = Mons$Game$map_del$(_pos$12, _adve_idx$16, _game$3);
                                                                    var _game$58 = Mons$Game$map_set$(_pos$12, _hero_idx$15, _hero_obj$14, _game$57);
                                                                    var $1901 = _set_stt_game$5(_game$58);
                                                                    var $1900 = $1901;
                                                                } else {
                                                                    var $1902 = _game$3;
                                                                    var $1900 = $1902;
                                                                };
                                                                var $1899 = $1900;
                                                            } else {
                                                                var $1903 = _game$3;
                                                                var $1899 = $1903;
                                                            };
                                                            var $1897 = $1899;
                                                        };
                                                        var $1789 = $1897;
                                                        break;
                                                };
                                                var $1787 = $1789;
                                                break;
                                        };
                                        var $1782 = $1787;
                                        break;
                                };
                                var $1780 = $1782;
                                break;
                        };
                        var $1776 = $1780;
                        break;
                };
                var $1773 = $1776;
                break;
            case 'Maybe.none':
                var _pos$6 = ((0 | 2048 | (2048 << 12) | (0 << 24)));
                var _obj$7 = Mons$Object$hero;
                var _game$8 = Mons$Game$map_push$(_pos$6, _obj$7, _game$3);
                var _game$9 = Mons$Game$set_user_pos$(_usr$2, _pos$6, _game$8);
                var $1904 = _game$9;
                var $1773 = $1904;
                break;
        };
        return $1773;
    };
    const Mons$Game$cmd = x0 => x1 => x2 => Mons$Game$cmd$(x0, x1, x2);

    function App$new$(_init$2, _draw$3, _when$4) {
        var $1905 = ({
            _: 'App.new',
            'init': _init$2,
            'draw': _draw$3,
            'when': _when$4
        });
        return $1905;
    };
    const App$new = x0 => x1 => x2 => App$new$(x0, x1, x2);

    function Mons$start$(_online$1) {
        var _screen$2 = Image3D$alloc_capacity$(524288);
        var $1906 = App$new$((() => {
            var _game_usr$3 = Word$zero$(160n);
            var _game_pos$4 = Map$new;
            var _game_map$5 = Mons$Map$build$(Mons$map_source);
            var _game$6 = Mons$Game$new$(_game_usr$3, _game_pos$4, _game_map$5, Mons$Screen$game$(46, Mons$Turn$empty), 0);
            var $1907 = _game$6;
            return $1907;
        })(), (_game$3 => {
            var $1908 = App$Render$pix$(Mons$draw$(_game$3, _screen$2));
            return $1908;
        }), (_event$3 => _game$4 => {
            var self = _online$1;
            if (self) {
                var self = _event$3;
                switch (self._) {
                    case 'App.Event.init':
                        var $1911 = self.addr;
                        var $1912 = List$cons$(App$Action$print$("Starting app."), List$cons$(App$Action$resize$(Mons$scr_w, Mons$scr_h), List$cons$(App$Action$state$(Mons$Game$set_usr$($1911, _game$4)), List$cons$(App$Action$watch$(Mons$App$room), List$cons$((() => {
                            var _chr$9 = Mons$Input$char$(Bool$true, 46);
                            var self = Mons$Input$serialize$(_chr$9);
                            switch (self._) {
                                case 'Maybe.some':
                                    var $1914 = self.value;
                                    var $1915 = App$Action$post$(Mons$App$room, $1914);
                                    var $1913 = $1915;
                                    break;
                                case 'Maybe.none':
                                    var $1916 = App$Action$print$("");
                                    var $1913 = $1916;
                                    break;
                            };
                            return $1913;
                        })(), List$nil)))));
                        var $1910 = $1912;
                        break;
                    case 'App.Event.tick':
                        var $1917 = self.time;
                        var $1918 = List$cons$(App$Action$state$(Mons$Game$tick$(_game$4, $1917)), List$nil);
                        var $1910 = $1918;
                        break;
                    case 'App.Event.xkey':
                        var $1919 = self.down;
                        var $1920 = self.code;
                        var _chr$8 = Mons$Input$char$($1919, $1920);
                        var self = Mons$Input$serialize$(_chr$8);
                        switch (self._) {
                            case 'Maybe.some':
                                var $1922 = self.value;
                                var $1923 = List$cons$(App$Action$post$(Mons$App$room, $1922), List$nil);
                                var $1921 = $1923;
                                break;
                            case 'Maybe.none':
                                var $1924 = List$nil;
                                var $1921 = $1924;
                                break;
                        };
                        var $1910 = $1921;
                        break;
                    case 'App.Event.post':
                        var $1925 = self.addr;
                        var $1926 = self.data;
                        var self = Mons$Input$deserialize$($1926);
                        switch (self._) {
                            case 'Maybe.some':
                                var $1928 = self.value;
                                var $1929 = List$cons$((() => {
                                    var self = _game$4;
                                    switch (self._) {
                                        case 'Mons.Game.new':
                                            var $1930 = App$Action$state$(Mons$Game$cmd$($1928, $1925, _game$4));
                                            return $1930;
                                    };
                                })(), List$nil);
                                var $1927 = $1929;
                                break;
                            case 'Maybe.none':
                                var $1931 = List$nil;
                                var $1927 = $1931;
                                break;
                        };
                        var $1910 = $1927;
                        break;
                };
                var $1909 = $1910;
            } else {
                var self = _event$3;
                switch (self._) {
                    case 'App.Event.init':
                        var $1933 = self.addr;
                        var $1934 = List$cons$(App$Action$resize$(Mons$scr_w, Mons$scr_h), List$cons$((() => {
                            var _game$9 = Mons$Game$set_usr$($1933, _game$4);
                            var _game$10 = Mons$Game$cmd$(100, $1933, _game$9);
                            var self = _game$10;
                            switch (self._) {
                                case 'Mons.Game.new':
                                    var $1936 = self.usr;
                                    var $1937 = self.map;
                                    var self = Mons$Game$get_hero_pos$(_game$10);
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $1939 = self.value;
                                            var $1940 = $1939;
                                            var _pos$16 = $1940;
                                            break;
                                        case 'Maybe.none':
                                            var $1941 = Mons$scr_mid;
                                            var _pos$16 = $1941;
                                            break;
                                    };
                                    var _hero_info$17 = Mons$Map$get_hero$(_pos$16, $1937);
                                    var _hero_obj$18 = Pair$fst$(_hero_info$17);
                                    var _hero_idx$19 = Pair$snd$(_hero_info$17);
                                    var _game$20 = Mons$Game$hero_inital_position$($1936, _hero_obj$18, _pos$16, 0, _game$10);
                                    var $1938 = App$Action$state$(_game$20);
                                    var $1935 = $1938;
                                    break;
                            };
                            return $1935;
                        })(), List$nil));
                        var $1932 = $1934;
                        break;
                    case 'App.Event.tick':
                        var $1942 = self.time;
                        var $1943 = List$cons$(App$Action$state$(Mons$Game$tick$(_game$4, $1942)), List$nil);
                        var $1932 = $1943;
                        break;
                    case 'App.Event.xkey':
                        var $1944 = self.down;
                        var $1945 = self.code;
                        var $1946 = List$cons$((() => {
                            var self = _game$4;
                            switch (self._) {
                                case 'Mons.Game.new':
                                    var $1947 = self.usr;
                                    var _chr$13 = Mons$Input$char$($1944, $1945);
                                    var $1948 = App$Action$state$(Mons$Game$cmd$(_chr$13, $1947, _game$4));
                                    return $1948;
                            };
                        })(), List$nil);
                        var $1932 = $1946;
                        break;
                    case 'App.Event.post':
                        var $1949 = List$nil;
                        var $1932 = $1949;
                        break;
                };
                var $1909 = $1932;
            };
            return $1909;
        }));
        return $1906;
    };
    const Mons$start = x0 => Mons$start$(x0);
    const Mons$off = Mons$start$(Bool$false);
    const Mons = Mons$off;
    return {
        'Buffer32.new': Buffer32$new,
        'Array': Array,
        'Array.tip': Array$tip,
        'Array.tie': Array$tie,
        'Array.alloc': Array$alloc,
        'U32.new': U32$new,
        'Word': Word,
        'Word.e': Word$e,
        'Word.o': Word$o,
        'Word.zero': Word$zero,
        'U32.zero': U32$zero,
        'Buffer32.alloc': Buffer32$alloc,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U32.eql': U32$eql,
        'Nat.apply': Nat$apply,
        'Word.i': Word$i,
        'Word.inc': Word$inc,
        'U32.inc': U32$inc,
        'Nat.to_u32': Nat$to_u32,
        'U32.shr': U32$shr,
        'U32.needed_depth.go': U32$needed_depth$go,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U32.sub': U32$sub,
        'U32.needed_depth': U32$needed_depth,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'Image3D.new': Image3D$new,
        'Image3D.alloc_capacity': Image3D$alloc_capacity,
        'Map.new': Map$new,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U32.add': U32$add,
        'List.ifor_u32': List$ifor_u32,
        'List': List,
        'Map': Map,
        'Mons.Map.new': Mons$Map$new,
        'List.length_u32_go': List$length_u32_go,
        'List.length_u32': List$length_u32,
        'U32.for': U32$for,
        'Word.div': Word$div,
        'U32.div': U32$div,
        'Word.or': Word$or,
        'U32.or': U32$or,
        'U32.shl': U32$shl,
        'Pos32.new': Pos32$new,
        'Word.fold': Word$fold,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Word.to_nat': Word$to_nat,
        'U32.to_nat': U32$to_nat,
        'String.nil': String$nil,
        'String.cons': String$cons,
        'String.take': String$take,
        'Nat.sub': Nat$sub,
        'String.drop': String$drop,
        'String.slice': String$slice,
        'Map.tie': Map$tie,
        'Maybe.some': Maybe$some,
        'Maybe.none': Maybe$none,
        'Map.set': Map$set,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Bits.i': Bits$i,
        'Word.to_bits': Word$to_bits,
        'U32.to_bits': U32$to_bits,
        'Mons.Map.set_list': Mons$Map$set_list,
        'Mons.Object.new': Mons$Object$new,
        'Mons.Dir.down': Mons$Dir$down,
        'Mons.Pad.new': Mons$Pad$new,
        'Mons.Pad.null': Mons$Pad$null,
        'List.nil': List$nil,
        'Pair.new': Pair$new,
        'Mons.Effect.new': Mons$Effect$new,
        'Mons.Effect.clear': Mons$Effect$clear,
        'Mons.Object.new_of_kind': Mons$Object$new_of_kind,
        'Mons.Kind.Terrain': Mons$Kind$Terrain,
        'Mons.Kind.new_terrain': Mons$Kind$new_terrain,
        'Mons.Kind.terrain.FLOOR': Mons$Kind$terrain$FLOOR,
        'Mons.Kind.terrain.PATH_BLOCKER': Mons$Kind$terrain$PATH_BLOCKER,
        'Bool.and': Bool$and,
        'U16.eql': U16$eql,
        'String.eql': String$eql,
        'Mons.Map.code_to_tile.aux': Mons$Map$code_to_tile$aux,
        'List.cons': List$cons,
        'Pair': Pair,
        'Mons.Kind.Mons': Mons$Kind$Mons,
        'Mons.Kind.new_mons': Mons$Kind$new_mons,
        'Mons.Kind.mons.MAGE': Mons$Kind$mons$MAGE,
        'Mons.Type.normal': Mons$Type$normal,
        'Mons.Kind.Const': Mons$Kind$Const,
        'Mons.Kind.new_const': Mons$Kind$new_const,
        'Mons.Kind.const.CRYSTAL': Mons$Kind$const$CRYSTAL,
        'Mons.Kind.const.FOUNTAIN': Mons$Kind$const$FOUNTAIN,
        'Mons.Kind.const.PORTAL': Mons$Kind$const$PORTAL,
        'Mons.Kind.terrain.VOID_BLACK': Mons$Kind$terrain$VOID_BLACK,
        'Mons.Kind.terrain.MID_CITY': Mons$Kind$terrain$MID_CITY,
        'Mons.Kind.terrain.STAIRS': Mons$Kind$terrain$STAIRS,
        'Mons.Kind.Interactive': Mons$Kind$Interactive,
        'Mons.Kind.new_interactive_tool': Mons$Kind$new_interactive_tool,
        'Mons.Kind.inter.HEAL': Mons$Kind$inter$HEAL,
        'Maybe': Maybe,
        'Map.get': Map$get,
        'Mons.Game.get_user_pos': Mons$Game$get_user_pos,
        'Mons.Game.get_hero_pos': Mons$Game$get_hero_pos,
        'Word.and': Word$and,
        'U32.and': U32$and,
        'Pos32.get_x': Pos32$get_x,
        'Pos32.get_y': Pos32$get_y,
        'Pos32.get_z': Pos32$get_z,
        'Mons.Map.get_list': Mons$Map$get_list,
        'Mons.Kind.is_hero': Mons$Kind$is_hero,
        'Mons.Object.get_kin': Mons$Object$get_kin,
        'List.ifind.go': List$ifind$go,
        'List.ifind': List$ifind,
        'Mons.Kind.terrain.VOID': Mons$Kind$terrain$VOID,
        'Mons.Object.void': Mons$Object$void,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'Mons.Map.get_hero': Mons$Map$get_hero,
        'Mons.Kind.const.CHEST': Mons$Kind$const$CHEST,
        'Mons.Map.push': Mons$Map$push,
        'Mons.Game.new': Mons$Game$new,
        'Mons.Game.set_map': Mons$Game$set_map,
        'Mons.Game.map_push': Mons$Game$map_push,
        'Mons.Object.get_adjacent_pos': Mons$Object$get_adjacent_pos,
        'Mons.Game.get_tile': Mons$Game$get_tile,
        'Mons.Object.get_adjacent_obj_list': Mons$Object$get_adjacent_obj_list,
        'Nat.eql': Nat$eql,
        'List.length': List$length,
        'Mons.Object.can_move_forward': Mons$Object$can_move_forward,
        'List.tail': List$tail,
        'List.delete_at_u32': List$delete_at_u32,
        'Mons.Map.del': Mons$Map$del,
        'Mons.Game.map_del': Mons$Game$map_del,
        'Mons.Object.heal_all_mons': Mons$Object$heal_all_mons,
        'List.update_at': List$update_at,
        'Mons.Map.set': Mons$Map$set,
        'Mons.Game.map_set': Mons$Game$map_set,
        'Mons.Kind.inter_lever_eff': Mons$Kind$inter_lever_eff,
        'Mons.Kind.inter.LEVER': Mons$Kind$inter$LEVER,
        'Mons.Kind.terrain.GRASS_PLANT': Mons$Kind$terrain$GRASS_PLANT,
        'Mons.Kind.terrain.PLANT_0': Mons$Kind$terrain$PLANT_0,
        'Mons.Map.code_to_tile': Mons$Map$code_to_tile,
        'Mons.Map.build': Mons$Map$build,
        'Mons.map_source': Mons$map_source,
        'Mons.Screen.game': Mons$Screen$game,
        'Mons.Turn.new': Mons$Turn$new,
        'Mons.Skill.none': Mons$Skill$none,
        'Mons.Turn.empty': Mons$Turn$empty,
        'App.Render.pix': App$Render$pix,
        'Image3D.set_length': Image3D$set_length,
        'Image3D.clear': Image3D$clear,
        'List.at': List$at,
        'Mons.Map.get': Mons$Map$get,
        'Mons.Game.dim': Mons$Game$dim,
        'Mons.Object.get_current_mon': Mons$Object$get_current_mon,
        'Mons.global_scr_mid': Mons$global_scr_mid,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.gtn': Word$gtn,
        'U32.gtn': U32$gtn,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'Mons.image_to_global': Mons$image_to_global,
        'Mons.Attr.new': Mons$Attr$new,
        'Word.mod': Word$mod,
        'U32.mod': U32$mod,
        'Mons.walk_char_pack': Mons$walk_char_pack,
        'U32.length': U32$length,
        'U32.slice': U32$slice,
        'U32.read_base': U32$read_base,
        'Image3D.parse_byte': Image3D$parse_byte,
        'Col32.new': Col32$new,
        'Word.trim': Word$trim,
        'Unit.new': Unit$new,
        'Array.extract_tip': Array$extract_tip,
        'Array.extract_tie': Array$extract_tie,
        'Word.foldl': Word$foldl,
        'Array.mut': Array$mut,
        'Array.set': Array$set,
        'Buffer32.set': Buffer32$set,
        'Image3D.set_pos': Image3D$set_pos,
        'Image3D.set_col': Image3D$set_col,
        'Image3D.push': Image3D$push,
        'Image3D.parse': Image3D$parse,
        'Mons.Assets.char.boy_r_0': Mons$Assets$char$boy_r_0,
        'Mons.Assets.char.boy_u_0': Mons$Assets$char$boy_u_0,
        'Mons.Assets.char.boy_l_0': Mons$Assets$char$boy_l_0,
        'Mons.Assets.char.boy_d_0': Mons$Assets$char$boy_d_0,
        'Mons.Assets.char.boy_r_1': Mons$Assets$char$boy_r_1,
        'Mons.Assets.char.boy_u_1': Mons$Assets$char$boy_u_1,
        'Mons.Assets.char.boy_l_1': Mons$Assets$char$boy_l_1,
        'Mons.Assets.char.boy_d_1': Mons$Assets$char$boy_d_1,
        'Mons.Assets.char.boy_r_2': Mons$Assets$char$boy_r_2,
        'Mons.Assets.char.boy_u_2': Mons$Assets$char$boy_u_2,
        'Mons.Assets.char.boy_l_2': Mons$Assets$char$boy_l_2,
        'Mons.Assets.char.boy_d_2': Mons$Assets$char$boy_d_2,
        'Bool.if': Bool$if,
        'Mons.Assets.char.battle_boy_u': Mons$Assets$char$battle_boy_u,
        'Mons.Skill.hero_kill': Mons$Skill$hero_kill,
        'Mons.Attr.new_hero': Mons$Attr$new_hero,
        'Mons.Kind.set_static_sprites': Mons$Kind$set_static_sprites,
        'Mons.Assets.char.mons_mage': Mons$Assets$char$mons_mage,
        'Mons.Assets.char.battle_mage_d': Mons$Assets$char$battle_mage_d,
        'Mons.Skill.hit_4': Mons$Skill$hit_4,
        'Mons.Skill.hit_2': Mons$Skill$hit_2,
        'Mons.Skill.heal': Mons$Skill$heal,
        'Mons.Skill.dummy_skills': Mons$Skill$dummy_skills,
        'Mons.Attr.new_mage': Mons$Attr$new_mage,
        'Image3D.empty': Image3D$empty,
        'Mons.Kind.set_pic': Mons$Kind$set_pic,
        'Mons.Kind.set_default_battle_spr': Mons$Kind$set_default_battle_spr,
        'Mons.Attr.new_neutral': Mons$Attr$new_neutral,
        'Mons.Kind.attr': Mons$Kind$attr,
        'Mons.Object.get_ani': Mons$Object$get_ani,
        'Mons.Object.is_standing': Mons$Object$is_standing,
        'Image3D.get_length': Image3D$get_length,
        'Array.get': Array$get,
        'Buffer32.get': Buffer32$get,
        'Image3D.get_pos': Image3D$get_pos,
        'Image3D.get_col': Image3D$get_col,
        'Pos32.sub': Pos32$sub,
        'Pos32.add': Pos32$add,
        'Mons.vox_mid': Mons$vox_mid,
        'Mons.draw.image': Mons$draw$image,
        'Mons.f_exe': Mons$f_exe,
        'List.for': List$for,
        'List.imap': List$imap,
        'List.indices.u32': List$indices$u32,
        'String.to_list': String$to_list,
        'U16.to_bits': U16$to_bits,
        'Mons.font.get_img': Mons$font$get_img,
        'Mons.draw.char': Mons$draw$char,
        'Mons.draw.text': Mons$draw$text,
        'Mons.draw.list.go': Mons$draw$list$go,
        'Mons.draw.list': Mons$draw$list,
        'Mons.font.set_img': Mons$font$set_img,
        'U16.new': U16$new,
        'U16.inc': U16$inc,
        'U16.zero': U16$zero,
        'Nat.to_u16': Nat$to_u16,
        'Mons.Char_black.100': Mons$Char_black$100,
        'Mons.Char_black.101': Mons$Char_black$101,
        'Mons.Char_black.102': Mons$Char_black$102,
        'Mons.Char_black.103': Mons$Char_black$103,
        'Mons.Char_black.104': Mons$Char_black$104,
        'Mons.Char_black.105': Mons$Char_black$105,
        'Mons.Char_black.106': Mons$Char_black$106,
        'Mons.Char_black.107': Mons$Char_black$107,
        'Mons.Char_black.108': Mons$Char_black$108,
        'Mons.Char_black.109': Mons$Char_black$109,
        'Mons.Char_black.110': Mons$Char_black$110,
        'Mons.Char_black.111': Mons$Char_black$111,
        'Mons.Char_black.112': Mons$Char_black$112,
        'Mons.Char_black.113': Mons$Char_black$113,
        'Mons.Char_black.114': Mons$Char_black$114,
        'Mons.Char_black.115': Mons$Char_black$115,
        'Mons.Char_black.116': Mons$Char_black$116,
        'Mons.Char_black.117': Mons$Char_black$117,
        'Mons.Char_black.118': Mons$Char_black$118,
        'Mons.Char_black.119': Mons$Char_black$119,
        'Mons.Char_black.120': Mons$Char_black$120,
        'Mons.Char_black.121': Mons$Char_black$121,
        'Mons.Char_black.122': Mons$Char_black$122,
        'Mons.Char_black.123': Mons$Char_black$123,
        'Mons.Char_black.124': Mons$Char_black$124,
        'Mons.Char_black.125': Mons$Char_black$125,
        'Mons.Char_black.126': Mons$Char_black$126,
        'Mons.Char_black.32': Mons$Char_black$32,
        'Mons.Char_black.33': Mons$Char_black$33,
        'Mons.Char_black.34': Mons$Char_black$34,
        'Mons.Char_black.35': Mons$Char_black$35,
        'Mons.Char_black.36': Mons$Char_black$36,
        'Mons.Char_black.37': Mons$Char_black$37,
        'Mons.Char_black.38': Mons$Char_black$38,
        'Mons.Char_black.39': Mons$Char_black$39,
        'Mons.Char_black.40': Mons$Char_black$40,
        'Mons.Char_black.41': Mons$Char_black$41,
        'Mons.Char_black.42': Mons$Char_black$42,
        'Mons.Char_black.43': Mons$Char_black$43,
        'Mons.Char_black.44': Mons$Char_black$44,
        'Mons.Char_black.45': Mons$Char_black$45,
        'Mons.Char_black.46': Mons$Char_black$46,
        'Mons.Char_black.47': Mons$Char_black$47,
        'Mons.Char_black.48': Mons$Char_black$48,
        'Mons.Char_black.49': Mons$Char_black$49,
        'Mons.Char_black.50': Mons$Char_black$50,
        'Mons.Char_black.51': Mons$Char_black$51,
        'Mons.Char_black.52': Mons$Char_black$52,
        'Mons.Char_black.53': Mons$Char_black$53,
        'Mons.Char_black.54': Mons$Char_black$54,
        'Mons.Char_black.55': Mons$Char_black$55,
        'Mons.Char_black.56': Mons$Char_black$56,
        'Mons.Char_black.57': Mons$Char_black$57,
        'Mons.Char_black.58': Mons$Char_black$58,
        'Mons.Char_black.59': Mons$Char_black$59,
        'Mons.Char_black.60': Mons$Char_black$60,
        'Mons.Char_black.61': Mons$Char_black$61,
        'Mons.Char_black.62': Mons$Char_black$62,
        'Mons.Char_black.63': Mons$Char_black$63,
        'Mons.Char_black.64': Mons$Char_black$64,
        'Mons.Char_black.65': Mons$Char_black$65,
        'Mons.Char_black.66': Mons$Char_black$66,
        'Mons.Char_black.67': Mons$Char_black$67,
        'Mons.Char_black.68': Mons$Char_black$68,
        'Mons.Char_black.69': Mons$Char_black$69,
        'Mons.Char_black.70': Mons$Char_black$70,
        'Mons.Char_black.71': Mons$Char_black$71,
        'Mons.Char_black.72': Mons$Char_black$72,
        'Mons.Char_black.73': Mons$Char_black$73,
        'Mons.Char_black.74': Mons$Char_black$74,
        'Mons.Char_black.75': Mons$Char_black$75,
        'Mons.Char_black.76': Mons$Char_black$76,
        'Mons.Char_black.77': Mons$Char_black$77,
        'Mons.Char_black.78': Mons$Char_black$78,
        'Mons.Char_black.79': Mons$Char_black$79,
        'Mons.Char_black.80': Mons$Char_black$80,
        'Mons.Char_black.81': Mons$Char_black$81,
        'Mons.Char_black.82': Mons$Char_black$82,
        'Mons.Char_black.83': Mons$Char_black$83,
        'Mons.Char_black.84': Mons$Char_black$84,
        'Mons.Char_black.85': Mons$Char_black$85,
        'Mons.Char_black.86': Mons$Char_black$86,
        'Mons.Char_black.87': Mons$Char_black$87,
        'Mons.Char_black.88': Mons$Char_black$88,
        'Mons.Char_black.89': Mons$Char_black$89,
        'Mons.Char_black.90': Mons$Char_black$90,
        'Mons.Char_black.91': Mons$Char_black$91,
        'Mons.Char_black.92': Mons$Char_black$92,
        'Mons.Char_black.93': Mons$Char_black$93,
        'Mons.Char_black.94': Mons$Char_black$94,
        'Mons.Char_black.95': Mons$Char_black$95,
        'Mons.Char_black.96': Mons$Char_black$96,
        'Mons.Char_black.97': Mons$Char_black$97,
        'Mons.Char_black.98': Mons$Char_black$98,
        'Mons.Char_black.99': Mons$Char_black$99,
        'Mons.Char_black.normal': Mons$Char_black$normal,
        'Mons.Char_black.earth': Mons$Char_black$earth,
        'Mons.Char_black.fire': Mons$Char_black$fire,
        'Mons.Char_black.water': Mons$Char_black$water,
        'Mons.Char_black.grass': Mons$Char_black$grass,
        'Mons.Char_black.electric': Mons$Char_black$electric,
        'Mons.Char_black.psychic': Mons$Char_black$psychic,
        'Mons.Char_black.ice': Mons$Char_black$ice,
        'Mons.Char_black.light': Mons$Char_black$light,
        'Mons.Char_black.darkness': Mons$Char_black$darkness,
        'Mons.Char_black.s_72': Mons$Char_black$s_72,
        'Mons.Char_black.s_80': Mons$Char_black$s_80,
        'Mons.Char_black.burn': Mons$Char_black$burn,
        'Mons.Char_black.hit': Mons$Char_black$hit,
        'Mons.Char_black.invulnerable': Mons$Char_black$invulnerable,
        'Mons.Char_black.minimize': Mons$Char_black$minimize,
        'Mons.Char_black.poison': Mons$Char_black$poison,
        'Mons.Char_black.protect': Mons$Char_black$protect,
        'Mons.Char_black.sleep': Mons$Char_black$sleep,
        'Mons.Char_black.font': Mons$Char_black$font,
        'Mons.draw.list_selector': Mons$draw$list_selector,
        'Mons.Char_white.100': Mons$Char_white$100,
        'Mons.Char_white.101': Mons$Char_white$101,
        'Mons.Char_white.102': Mons$Char_white$102,
        'Mons.Char_white.103': Mons$Char_white$103,
        'Mons.Char_white.104': Mons$Char_white$104,
        'Mons.Char_white.105': Mons$Char_white$105,
        'Mons.Char_white.106': Mons$Char_white$106,
        'Mons.Char_white.107': Mons$Char_white$107,
        'Mons.Char_white.108': Mons$Char_white$108,
        'Mons.Char_white.109': Mons$Char_white$109,
        'Mons.Char_white.110': Mons$Char_white$110,
        'Mons.Char_white.111': Mons$Char_white$111,
        'Mons.Char_white.112': Mons$Char_white$112,
        'Mons.Char_white.113': Mons$Char_white$113,
        'Mons.Char_white.114': Mons$Char_white$114,
        'Mons.Char_white.115': Mons$Char_white$115,
        'Mons.Char_white.116': Mons$Char_white$116,
        'Mons.Char_white.117': Mons$Char_white$117,
        'Mons.Char_white.118': Mons$Char_white$118,
        'Mons.Char_white.119': Mons$Char_white$119,
        'Mons.Char_white.120': Mons$Char_white$120,
        'Mons.Char_white.121': Mons$Char_white$121,
        'Mons.Char_white.122': Mons$Char_white$122,
        'Mons.Char_white.123': Mons$Char_white$123,
        'Mons.Char_white.124': Mons$Char_white$124,
        'Mons.Char_white.125': Mons$Char_white$125,
        'Mons.Char_white.126': Mons$Char_white$126,
        'Mons.Char_white.32': Mons$Char_white$32,
        'Mons.Char_white.33': Mons$Char_white$33,
        'Mons.Char_white.34': Mons$Char_white$34,
        'Mons.Char_white.35': Mons$Char_white$35,
        'Mons.Char_white.36': Mons$Char_white$36,
        'Mons.Char_white.37': Mons$Char_white$37,
        'Mons.Char_white.38': Mons$Char_white$38,
        'Mons.Char_white.39': Mons$Char_white$39,
        'Mons.Char_white.40': Mons$Char_white$40,
        'Mons.Char_white.41': Mons$Char_white$41,
        'Mons.Char_white.42': Mons$Char_white$42,
        'Mons.Char_white.43': Mons$Char_white$43,
        'Mons.Char_white.44': Mons$Char_white$44,
        'Mons.Char_white.45': Mons$Char_white$45,
        'Mons.Char_white.46': Mons$Char_white$46,
        'Mons.Char_white.47': Mons$Char_white$47,
        'Mons.Char_white.48': Mons$Char_white$48,
        'Mons.Char_white.49': Mons$Char_white$49,
        'Mons.Char_white.50': Mons$Char_white$50,
        'Mons.Char_white.51': Mons$Char_white$51,
        'Mons.Char_white.52': Mons$Char_white$52,
        'Mons.Char_white.53': Mons$Char_white$53,
        'Mons.Char_white.54': Mons$Char_white$54,
        'Mons.Char_white.55': Mons$Char_white$55,
        'Mons.Char_white.56': Mons$Char_white$56,
        'Mons.Char_white.57': Mons$Char_white$57,
        'Mons.Char_white.58': Mons$Char_white$58,
        'Mons.Char_white.59': Mons$Char_white$59,
        'Mons.Char_white.60': Mons$Char_white$60,
        'Mons.Char_white.61': Mons$Char_white$61,
        'Mons.Char_white.62': Mons$Char_white$62,
        'Mons.Char_white.63': Mons$Char_white$63,
        'Mons.Char_white.64': Mons$Char_white$64,
        'Mons.Char_white.65': Mons$Char_white$65,
        'Mons.Char_white.66': Mons$Char_white$66,
        'Mons.Char_white.67': Mons$Char_white$67,
        'Mons.Char_white.68': Mons$Char_white$68,
        'Mons.Char_white.69': Mons$Char_white$69,
        'Mons.Char_white.70': Mons$Char_white$70,
        'Mons.Char_white.71': Mons$Char_white$71,
        'Mons.Char_white.72': Mons$Char_white$72,
        'Mons.Char_white.73': Mons$Char_white$73,
        'Mons.Char_white.74': Mons$Char_white$74,
        'Mons.Char_white.75': Mons$Char_white$75,
        'Mons.Char_white.76': Mons$Char_white$76,
        'Mons.Char_white.77': Mons$Char_white$77,
        'Mons.Char_white.78': Mons$Char_white$78,
        'Mons.Char_white.79': Mons$Char_white$79,
        'Mons.Char_white.80': Mons$Char_white$80,
        'Mons.Char_white.81': Mons$Char_white$81,
        'Mons.Char_white.82': Mons$Char_white$82,
        'Mons.Char_white.83': Mons$Char_white$83,
        'Mons.Char_white.84': Mons$Char_white$84,
        'Mons.Char_white.85': Mons$Char_white$85,
        'Mons.Char_white.86': Mons$Char_white$86,
        'Mons.Char_white.87': Mons$Char_white$87,
        'Mons.Char_white.88': Mons$Char_white$88,
        'Mons.Char_white.89': Mons$Char_white$89,
        'Mons.Char_white.90': Mons$Char_white$90,
        'Mons.Char_white.91': Mons$Char_white$91,
        'Mons.Char_white.92': Mons$Char_white$92,
        'Mons.Char_white.93': Mons$Char_white$93,
        'Mons.Char_white.94': Mons$Char_white$94,
        'Mons.Char_white.95': Mons$Char_white$95,
        'Mons.Char_white.96': Mons$Char_white$96,
        'Mons.Char_white.97': Mons$Char_white$97,
        'Mons.Char_white.98': Mons$Char_white$98,
        'Mons.Char_white.99': Mons$Char_white$99,
        'Mons.Char_white.font': Mons$Char_white$font,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Mons.Object.get_dir': Mons$Object$get_dir,
        'Mons.draw.global_xy': Mons$draw$global_xy,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.div': Nat$div,
        'Mons.draw.cur_sprite': Mons$draw$cur_sprite,
        'Mons.Sprite.new': Mons$Sprite$new,
        'Mons.game_sprites': Mons$game_sprites,
        'Mons.scr_mid': Mons$scr_mid,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U32.lte': U32$lte,
        'Mons.Map.build_sprites': Mons$Map$build_sprites,
        'Mons.draw.text_screen_bg': Mons$draw$text_screen_bg,
        'Mons.draw.msg_screen.line_0': Mons$draw$msg_screen$line_0,
        'Mons.draw.msg_screen.line_1': Mons$draw$msg_screen$line_1,
        'Mons.draw.mage_talk': Mons$draw$mage_talk,
        'Mons.Object.get_images': Mons$Object$get_images,
        'Mons.Kind.get_name': Mons$Kind$get_name,
        'Mons.Object.get_names': Mons$Object$get_names,
        'Mons.draw.list_image.go': Mons$draw$list_image$go,
        'Mons.draw.list_image': Mons$draw$list_image,
        'Mons.draw.mon_img_selected': Mons$draw$mon_img_selected,
        'Mons.draw.initial_mons': Mons$draw$initial_mons,
        'String.concat': String$concat,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'Mons.draw.img_type': Mons$draw$img_type,
        'Mons.draw.small_HP': Mons$draw$small_HP,
        'List.fold': List$fold,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Nat.gtn': Nat$gtn,
        'Nat.lte': Nat$lte,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'U32.to_string': U32$to_string,
        'Bool.not': Bool$not,
        'Mons.Object.remaining_hp': Mons$Object$remaining_hp,
        'Mons.Object.is_obj_defeated': Mons$Object$is_obj_defeated,
        'Mons.Object.is_battling': Mons$Object$is_battling,
        'Mons.draw.background': Mons$draw$background,
        'Mons.draw.get_battle_bg': Mons$draw$get_battle_bg,
        'Mons.draw.battle_bg': Mons$draw$battle_bg,
        'Mons.draw.hero_hp': Mons$draw$hero_hp,
        'Mons.draw.adve_hp': Mons$draw$adve_hp,
        'Mons.draw.effect': Mons$draw$effect,
        'Mons.draw.effects': Mons$draw$effects,
        'Mons.Turn.is_active': Mons$Turn$is_active,
        'Mons.Turn.hero_turn': Mons$Turn$hero_turn,
        'Mons.Skill.get_name': Mons$Skill$get_name,
        'Mons.Skill.short_description': Mons$Skill$short_description,
        'Mons.draw.turn': Mons$draw$turn,
        'Mons.Kind.get_skills': Mons$Kind$get_skills,
        'Mons.Game.get_skills_at': Mons$Game$get_skills_at,
        'Mons.draw.battle_skills': Mons$draw$battle_skills,
        'Mons.draw.get_full_bg': Mons$draw$get_full_bg,
        'Mons.draw.capture_bg': Mons$draw$capture_bg,
        'Mons.draw.battle_win_bg': Mons$draw$battle_win_bg,
        'Mons.Kind.is_portal': Mons$Kind$is_portal,
        'Bool.or': Bool$or,
        'Mons.Game.defeated_lvl_mons': Mons$Game$defeated_lvl_mons,
        'Mons.Assets.void': Mons$Assets$void,
        'Mons.Object.qtd_mons_defeated': Mons$Object$qtd_mons_defeated,
        'Mons.draw.bag_select': Mons$draw$bag_select,
        'Mons.draw.bag': Mons$draw$bag,
        'Mons.draw.full_bag': Mons$draw$full_bag,
        'Mons.draw': Mons$draw,
        'App.Action': App$Action,
        'App.Action.print': App$Action$print,
        'App.Action.resize': App$Action$resize,
        'Mons.scr_w': Mons$scr_w,
        'Mons.scr_h': Mons$scr_h,
        'App.Action.state': App$Action$state,
        'Mons.Game.set_usr': Mons$Game$set_usr,
        'App.Action.watch': App$Action$watch,
        'Word.from_bits': Word$from_bits,
        'Bits.concat': Bits$concat,
        'String.to_bits': String$to_bits,
        'Mons.App.room': Mons$App$room,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'U16.gte': U16$gte,
        'U16.lte': U16$lte,
        'U16.sub': U16$sub,
        'Char.to_upper': Char$to_upper,
        'U16.add': U16$add,
        'Char.to_lower': Char$to_lower,
        'Mons.Input.char': Mons$Input$char,
        'Mons.Input.list': Mons$Input$list,
        'Mons.Input.char_to_code_map': Mons$Input$char_to_code_map,
        'Mons.Input.serialize': Mons$Input$serialize,
        'App.Action.post': App$Action$post,
        'Mons.Object.set_ani': Mons$Object$set_ani,
        'Mons.Object.set_dir': Mons$Object$set_dir,
        'Mons.Object.is_free_to_move': Mons$Object$is_free_to_move,
        'Mons.Dir.up': Mons$Dir$up,
        'Mons.Dir.left': Mons$Dir$left,
        'Mons.Dir.right': Mons$Dir$right,
        'Mons.Object.tick': Mons$Object$tick,
        'Mons.Dir.move': Mons$Dir$move,
        'Mons.Map.pop': Mons$Map$pop,
        'Mons.Map.get_top': Mons$Map$get_top,
        'Mons.Object.is_walking': Mons$Object$is_walking,
        'Mons.Kind.get_blocks': Mons$Kind$get_blocks,
        'Mons.Game.move_obj': Mons$Game$move_obj,
        'Mons.Game.set_user_pos': Mons$Game$set_user_pos,
        'Mons.Game.tick_user': Mons$Game$tick_user,
        'Mons.Game.set_tik': Mons$Game$set_tik,
        'Mons.Game.tick_game': Mons$Game$tick_game,
        'Mons.Game.tick': Mons$Game$tick,
        'Bits.slice': Bits$slice,
        'Mons.Input.code_to_char_map': Mons$Input$code_to_char_map,
        'Mons.Input.deserialize': Mons$Input$deserialize,
        'Mons.Game.set_stt': Mons$Game$set_stt,
        'Mons.Kind.mons.HERO': Mons$Kind$mons$HERO,
        'Mons.Type.fire': Mons$Type$fire,
        'Mons.Object.hero': Mons$Object$hero,
        'Mons.Object.ended_battle': Mons$Object$ended_battle,
        'Mons.Screen.introduction': Mons$Screen$introduction,
        'Mons.Screen.credits': Mons$Screen$credits,
        'Mons.Screen.welcome': Mons$Screen$welcome,
        'List.elem': List$elem,
        'Char.eql': Char$eql,
        'Mons.is_walk_cmd': Mons$is_walk_cmd,
        'Mons.key_to_dir': Mons$key_to_dir,
        'Mons.Object.set_pad': Mons$Object$set_pad,
        'Mons.Pad.set_r': Mons$Pad$set_r,
        'Mons.Object.set_pad_r': Mons$Object$set_pad_r,
        'Mons.Pad.set_u': Mons$Pad$set_u,
        'Mons.Object.set_pad_u': Mons$Object$set_pad_u,
        'Mons.Pad.set_l': Mons$Pad$set_l,
        'Mons.Object.set_pad_l': Mons$Object$set_pad_l,
        'Mons.Pad.set_d': Mons$Pad$set_d,
        'Mons.Object.set_pad_d': Mons$Object$set_pad_d,
        'Mons.dir_to_set_pad': Mons$dir_to_set_pad,
        'Char.is_upper': Char$is_upper,
        'Mons.Game.update': Mons$Game$update,
        'Mons.Game.walk': Mons$Game$walk,
        'Mons.Kind.is_mage': Mons$Kind$is_mage,
        'Mons.Object.set_bag': Mons$Object$set_bag,
        'Mons.Kind.mons.POISOLICK': Mons$Kind$mons$POISOLICK,
        'Mons.Kind.mons.AZULA': Mons$Kind$mons$AZULA,
        'Mons.Kind.mons.EMERELDER': Mons$Kind$mons$EMERELDER,
        'Mons.Object.set_dmg': Mons$Object$set_dmg,
        'Nat.ltn': Nat$ltn,
        'List.pure': List$pure,
        'List.append': List$append,
        'Mons.Object.push_to_bag': Mons$Object$push_to_bag,
        'Mons.initial_mons': Mons$initial_mons,
        'Mons.Screen.intro_select': Mons$Screen$intro_select,
        'Mons.Type.earth': Mons$Type$earth,
        'Mons.Object.set_mon': Mons$Object$set_mon,
        'Mons.Object.delete_init_mons': Mons$Object$delete_init_mons,
        'U32.gte': U32$gte,
        'Mons.Game.adve_turn': Mons$Game$adve_turn,
        'Mons.Effect.upd_initial_eff': Mons$Effect$upd_initial_eff,
        'Mons.Object.set_eff': Mons$Object$set_eff,
        'Mons.Skill.update_mon_obj': Mons$Skill$update_mon_obj,
        'Mons.Effect.has_invulnerable': Mons$Effect$has_invulnerable,
        'Mons.Effect.has_burn': Mons$Effect$has_burn,
        'Mons.Effect.has_hit': Mons$Effect$has_hit,
        'Mons.Effect.has_poison': Mons$Effect$has_poison,
        'Mons.Skill.apply_inital_eff_dmg': Mons$Skill$apply_inital_eff_dmg,
        'Mons.Effect.has_protect': Mons$Effect$has_protect,
        'Mons.Effect.has_minimize': Mons$Effect$has_minimize,
        'Mons.Object.get_dmg': Mons$Object$get_dmg,
        'Mons.Object.hit': Mons$Object$hit,
        'Mons.Skill.damage_eff': Mons$Skill$damage_eff,
        'Mons.Skill.apply_inital_eff': Mons$Skill$apply_inital_eff,
        'Mons.Effect.has_sleep': Mons$Effect$has_sleep,
        'Mons.Type.skill_n_type': Mons$Type$skill_n_type,
        'Mons.Object.heal': Mons$Object$heal,
        'Mons.Skill.heal_eff': Mons$Skill$heal_eff,
        'Mons.Effect.set_invulnerable': Mons$Effect$set_invulnerable,
        'Mons.Skill.invulnerable_eff': Mons$Skill$invulnerable_eff,
        'Mons.Effect.set_hit': Mons$Effect$set_hit,
        'Mons.Skill.hit_next_eff': Mons$Skill$hit_next_eff,
        'Mons.Effect.set_burn': Mons$Effect$set_burn,
        'Mons.Skill.burn_eff': Mons$Skill$burn_eff,
        'Mons.Effect.set_protect': Mons$Effect$set_protect,
        'Mons.Skill.protect_eff': Mons$Skill$protect_eff,
        'Mons.Effect.set_poison': Mons$Effect$set_poison,
        'Mons.Skill.poison_eff': Mons$Skill$poison_eff,
        'Mons.Skill.critical_hit': Mons$Skill$critical_hit,
        'Mons.Skill.is_critical': Mons$Skill$is_critical,
        'Mons.Kind.get_agi': Mons$Kind$get_agi,
        'Mons.Effect.set_minimize': Mons$Effect$set_minimize,
        'Mons.Skill.minimize_eff': Mons$Skill$minimize_eff,
        'Mons.Effect.set_sleep': Mons$Effect$set_sleep,
        'Mons.Skill.sleep_eff': Mons$Skill$sleep_eff,
        'Mons.Skill.cast': Mons$Skill$cast,
        'Mons.Skill.run': Mons$Skill$run,
        'Mons.Game.hero_start_attacking': Mons$Game$hero_start_attacking,
        'Mons.Game.exec_turn': Mons$Game$exec_turn,
        'Mons.Kind.is_mon_area': Mons$Kind$is_mon_area,
        'Mons.Kind.area_mon_pos': Mons$Kind$area_mon_pos,
        'Mons.Screen.inventory': Mons$Screen$inventory,
        'Mons.Skill.clear_after_battle': Mons$Skill$clear_after_battle,
        'Mons.Object.set_cap': Mons$Object$set_cap,
        'Mons.Object.add_defeated_mon': Mons$Object$add_defeated_mon,
        'Mons.Object.set_bos': Mons$Object$set_bos,
        'Mons.Object.capture_boss': Mons$Object$capture_boss,
        'Mons.Game.delete_adve_obj': Mons$Game$delete_adve_obj,
        'Mons.Object.is_full_bag': Mons$Object$is_full_bag,
        'Mons.Screen.capture_mon': Mons$Screen$capture_mon,
        'Mons.Kind.get_pos': Mons$Kind$get_pos,
        'Mons.Game.add_mon': Mons$Game$add_mon,
        'List.delete_at': List$delete_at,
        'Mons.Object.delete_from_bag': Mons$Object$delete_from_bag,
        'Mons.Screen.game_over': Mons$Screen$game_over,
        'Mons.Turn.is_last_player_move': Mons$Turn$is_last_player_move,
        'Mons.Turn.hero_run': Mons$Turn$hero_run,
        'Mons.Effect.upd_end_turn_eff': Mons$Effect$upd_end_turn_eff,
        'Mons.Skill.apply_end_turn_eff': Mons$Skill$apply_end_turn_eff,
        'Mons.Game.move_hero_down': Mons$Game$move_hero_down,
        'Mons.Kind.mons.ZOIO': Mons$Kind$mons$ZOIO,
        'Mons.Kind.mons.MIMIC': Mons$Kind$mons$MIMIC,
        'Mons.Kind.mons.MIMIC2': Mons$Kind$mons$MIMIC2,
        'Mons.Kind.mons.CYCLOPE': Mons$Kind$mons$CYCLOPE,
        'Mons.Kind.mons.TROWL': Mons$Kind$mons$TROWL,
        'Mons.Kind.mons.EMERELDER2': Mons$Kind$mons$EMERELDER2,
        'Mons.Game.add_boss': Mons$Game$add_boss,
        'Mons.Kind.mons.BEHOLDER': Mons$Kind$mons$BEHOLDER,
        'Mons.Game.add_mons_to_map': Mons$Game$add_mons_to_map,
        'Mons.Game.hero_inital_position': Mons$Game$hero_inital_position,
        'Mons.Object.get_adjacent_obj': Mons$Object$get_adjacent_obj,
        'Mons.Object.hero_can_push_obj': Mons$Object$hero_can_push_obj,
        'Mons.Kind.exec_eff': Mons$Kind$exec_eff,
        'Mons.Object.set_kin': Mons$Object$set_kin,
        'Mons.Object.update_interactive': Mons$Object$update_interactive,
        'Mons.Kind.set_on_interactive': Mons$Kind$set_on_interactive,
        'Mons.Game.cmd': Mons$Game$cmd,
        'App.new': App$new,
        'Mons.start': Mons$start,
        'Mons.off': Mons$off,
        'Mons': Mons,
    };
})();