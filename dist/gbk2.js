/*!
 * gbk.js v0.2.1
 * Homepage https://github.com/cnwhy/GBK.js
 * License MIT
 */
(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//用二分法的形式 搜索;
(function (name, factory) {
	if (typeof define === 'function' && (define.amd || define.cmd)) {
		define([], factory);
	} else if (typeof window !== "undefined" || typeof self !== "undefined") {
		var global = typeof window !== "undefined" ? window : self;
		global[name] = factory();
	} else {
		throw new Error("加载 " + name + " 模块失败！，请检查您的环境！")
	}
}('GBK', function () {
	// 多进制转换后的数字还原函数
	var Fn_Hex_decode = function decode(){
			var n = 0, str = arguments[0];
			for (var i = 0,w = str.length; i < w; i++) {
				var code = str.charCodeAt(i);
				if(code < 63 || code > 126) return NaN;
				n += (code - 63) * Math.pow(64, w - i - 1);
			}
			return n;
		};
	// 解压Unicode编码字符串函数
	var Fn_unzip = function unZip() {
		return arguments[0].replace(/\#(\d+)\$/g, function (a, b) {
				return Array(+b + 4).join('#');
			})
			.replace(/[\x3f-\x7e]\-[\x3f-\x7e]/g,function(a){
				var b = a.substr(0,1).charCodeAt(0)
					,e = a.substr(2).charCodeAt(0)
					,str = String.fromCharCode(b);				
				while(b++<e){
					str += String.fromCharCode(b);
				}
				return str;
			})
			.replace(/\#/g, '###')
			.replace(/([\x3f-\x7e]{2})\+([\x3f-\x7e\#]+)(?:\,|$)/g, function (all, hd, dt) {
				return dt.replace(/./g, function (a) {
					if (a != '#') {
						return hd + a;
					} else {
						return a;
					}
				});
			})
			.match(/.../g);
	};

	var GBK = function () {

		/**
		 * 生成按GBk编码顺数排列的编码映射数组
		 */
		function getSortGBK(gbk) {
			var data = []
			for (var i = 0x81, k = 0; i <= 0xfe; i++) {
				for (var j = 0x40; j <= 0xfe; j++) {
					if (
						(j == 0x7f) ||
						((0xa1 <= i && i <= 0xa7) && j <= 0xa0) ||
						((0xaa <= i && i <= 0xaf) && j >= 0xa1) ||
						(0xf8 <= i && j >= 0xa1)
					) {
						continue;
					}
					var hex = gbk[k++];
					var key = Fn_Hex_decode(hex);
					if (isNaN(key)) continue;
					data.push([key, i << 8 | j])
				}
			}
			return data;
		};

		// 以GBk编码顺数排列的编码映射数组
		var data_sort_gbk = getSortGBK(Fn_unzip("Cw+AC-ENQV^-`behmnprtv{,Cx+?@ACEIPTVYZa-dfgi-nqs-|~,Cy+?@-DFIOUVX[-]bin-psu-x{-},Cz+GKNOQY-[_aefhl-npsw-y{},C{+?A-GJKQ-U[\\`bghk-mprtvxz}~,C|+?@ACDF-KQSU`aegijlmpqtv-y|,C}+?@AD-FIKMOQRTUW-Y[]^`acjlo-su-},C~+?@AE-HJ-LQ-UXZ_acdfjkoqs-vxz-|~,D?+?@-JMOPRT-VZ\\]_a-cfjn-xz|~,D@+?@AC-EH-JLO-SU-XZ\\-ce-jl-tw-y{|,DA+@A-CEFH-KM-aceijl-pr-x{-~,DB+?@-MO-TV-XZ-dg-jn-qsu-y{-~,DC+?@-DG-IK-PR-_a-},DD+AFIKM-OQRV-XZ\\-`bcefhinqy}~,DE+BCEFIJM-PRSWY\\-^`be-ilmsw-y}~,DF+@ABDGILMOQ-Y[]^abd-ikmpqsv},DG+CDHJKNOR-T[]^`-bd-fiknpqst{},DH+CD-HJMNQRTV-Z\\^_a-cegj-mopr-{},DI+?B-FH-NPQS-Y[c-fm-os-|,DJ+?@AC-EGIK-NPR-TVX-]_-bd-np-wz-|,DK+@A-CFH-KMP-SWZ[]^acdf-hj-ln-w{|,DL+?ACEJ-LOSWXZ\\dgiklquxz-},DM+?@BFGIM-SUVXZ[]_`cfi-ln-tv-y{-},DN+?B-FM-OQRTY[-]`afsy}~,DO+?ADFJSW-Y[acdioruvy|~,DP+@ACDFHK-NPY\\-`bdfh-osxy}~,DQ+@BDF-ILPRVW[]-admoqt-vxy{},DR+BDIJUWZ_-cjkn-ps-xz},DS+?A-DGI-MQRT-Y[-^`deghjlqs-uw-z|,DT+?ADFGJ-NP-SV-Z\\-_abghjn-sxy|~,DU+DEK-MOQRT-VYZ]_-eg-oqsuwy{~,DV+?@-BE-GIJM-OTV-Z]_afhlmopsuw-{~,DW+AB-FIJLO-VXY[\\_-adeg-jm-ortvwy{-},DX+?@-JN-RTUYZ\\-`bd-fl-oq-tv-y|-~,DY+?@-CF-LO-QS-ac-mo-uw-z|-~,DZ+?@-HJ-RTUWX[bd-ikmnqru-wz{,D[+?@ADFJ-Z\\]_-ac-fjpqs-w{|~,D\\+@B-EGHJQ-UWXabdfkmo-qstw-y|-~,D]+?@F-IL-PS-Y[-^dgikn-prt-vx-~,D^+?@C-IKLOPRUVZ[]`-bd-kmo-rt-vz{}~,D_+@B-DG-IKM-OQ-SU-WY-\\^abd-hj-np-su-~,D`+?@-BD-JM-OQRT-VX-\\^-ce-il-|~,Da+ACE-GI-PS-WZ-\\_-fi-z|-~,Db+?A-CE-OQ-SU-bd-ilnpqstvwy-~,Dc+?@BDEG-KMO-RVWZ\\]_-begkoqrtuz|-~,Dd+?BDEIKLOQRXZ-^`bce-qtvy-{}~,De+?DHJKM-PSTWY-\\^-aefklopr-wy{|~,Df+?@-DF-HK-NTUXZ]-acefh-jl-wy{-},Dg+?AIJL-OQS-VX-Z\\]`ace-gi-ortv-z|-~,Dh+@A-DFGJ-SU-XZ-`b-eghj-rwxz-},Di+?@-PR-X[-hj-psuvx-|~,Dj+?B-GIJL-PRTVX-Z\\-^acdfgik-oq-~,Dk+?@-GI-TW-prtuw-~,Dl+@A-NQU]_`fgjl-nqsu-xz{}~,Dm+AEILMO-QSU^f-hk-npqvy-{,Dn+?@BG-JL-NPS-[_abefh-lnp-v|},Do+?ABDFGJ-MOQRVXZ]-`beg-jl-oqrt-v,Dp+BCEFKLQ-SU-WY-\\^acf-loq-wz-},Dq+?B-FH-JMNQRT\\-`c-gim-oqsux-{},Dr+?ABD-IK-PR-WY-_abfhjkmnp-y{-~,Ds+?@CDG-LN-RTV-Y[\\^-bdgi-kn-rt-{~,Dt+?@-EGHL-VXY[]-gilmo-rt-~,Du+?@B-WY-[]-uw-~,Dv+?@-CE-KM-Y[^_bciklotuw-{~,Dw+?CFH-JLMQRV]-dg-knoq-uxy}~,Dx+?@BE-JL-RU-Y[\\^_b-ptvx},Dy+@ABDGHK-MQWZ\\`-cg-km-qsy-|~,Dz+?@-GJ-OSTV-Y[-fhj-rtwxz-|,D{+DEFHK-MOQSUXY[-]`-cgjkmoq-wz|-~,D|+@A-NPSX-[]-_bdfgjmnqs-uwy|-~,D}+BEL-NPRSUYZ\\-_a-fhjkn-suw-z}~,D~+?@AFGIJMR-TY-[]^abdeghknoq-suvxy{,E?+FGHJKOPRVWY]^a-ck-mo-su-y|},E@+?C-IKMNPRSU-WZ[]-`dempqstv},EA+?@AD-GIJM-PRTV-X[]`acdfhimort-vxy|-~,EB+?@-CF-HK-OQ-SUVXZ]`-dipqtvwz-~,EC+AB-DFI-KO-SU-XZ-]`adg-ik-},ED+?@-FHJLNOQ-SU-[]-`b-eh-np-suw-~,EE+?@-IKLN-RT-[]-eijl-uw-|~,EF+?@B-FHK-ORT-df-su-},EG+?@-DFHRSX[-]_be-hjln-qtuw-{,EH+AC-EINOT-VXY[-acdgpqstvwyz|,EI+@ABD-GJ-OSX[-]befhil-oq-su-wy},EJ+?@BJNPT\\]_`cijoqtw-z,EK+?B-EI-LNOQ-TV-X[efhk-mopr-wz{}~,EL+?@CFGIP-SU-\\_c-egi-knoq-twx{-~,EM+@B-EJLPR-TVX-^`cejnpqtuxz|~,EN+?@-BDFGI-KPR-TV-\\^ac-gjkm-prtvx-{},EO+BCE-ILMPQT-Y\\^a-df-hjm-rt-xz{},EP+?ABHJ-PRT-VX-\\^-egi-km-vz-~,EQ+?@BEG-ORSVWY-\\^-bd-gijnp-suxz|-~,ER+@BCE-KNPR-UX-\\^-`bdf-~,ES+@A-GI-PR-VX-ce-iklo-rvy{|,ET+?@-CEFIJLMOQ-SVWY[^-`cdf-il-nprtuw-~,EU+?@-EG-IL-NQS-UWY\\]_abegikmp-wyz}~,EV+?AF-ILOPR-TW-^`bcijq-twxz-~,EW+@CDF-HJLO-QU-WY-[]`-ceh-kmoqrv-z|~,EX+?AC-ILMOPWXZ-]_abdfh-lp-rtwxz-|~,EY+?@BDEG-JL-OQ-TW-[]-eh-ln-rt-wy-|~,EZ+?@-WY]-dfgi-nptuwyz|,E[+@A-FKMNP-RUW-Y[]_-dfhmoqru-xz{}~,E\\+@CDFIJLQSTV-Z\\a-cefjkmpsuw-z|,E]+?ABDEGIK-NP-SUXZ^-`cehkmpqsx-~,E^+?AD-MT-VZ^`bce-gijlmqt-{},E_+@A-CELOQSTW-[]-_a-gj-ps-uyz~,E`+FJLNQU-^ik-rtw-~,Ea+?ACF-MO-QS-UW-`b-dh-kmpqsu-~,Eb+@B-GIKM-PRSUVXZ-^`ac-lnq-su-wz|-~,Ec+?A-CE-IKNPR-]`-bd-kmnp-rt-wy-{},Ed+?@B-RTUWXZ[^`acdf-iklnoq-uyz|-~,Ee+@BDI-KM-RUVXY\\-ehikm-oqrtuw-y{-~,Ef+?A-HJLNP-RT-Y[-]`-km-pr-{},Eg+?@-HJ-UX-]_a-fhj-moq-su-{~,Eh+?@-BDEG-NP-VY[-_a-ce-oq-wyz|-~,Ei+@ABD-LNQ-UW-^`-gil-~,Ej+?@-~,Ek+?@-^deg-pr-uwz-|~,El+?@ACDGIJL-WY-`ghj-wy|-~,Em+?DGKM-PSTV-X[-_a-hj-quw-},En+?BCE-IKMOPWY[-_a-hk-mo-qsu-wy-{}~,Eo+?@-CG-KMQV[-]_bdj-lpruvx-{}~,Ep+BCDGJ-NP-RUW-Yabd-fj-nprtvwy-{~,Eq+?CFIJLMPQT-WY[-]_agknos-vy,Er+?@-BE-GJL-NPQW-Y[\\^cefhklqsx~,Es+?ABDEG-ILN-PR-UW[\\^-ceghklnosu-wy~,Et+?ACHKOT-WZ\\^`acdfgj-lo-rtux-z|-~,Eu+?@BCEFIJLNOQU-Y[adkloprsuvx-},Ev+@ABG-IL-OQ-TVY-[^abdf-ilnoqs-uwy|-~,Ew+?@-CE-HJNQRTWXZ[]^ae-gikmoprt-vxz-~,Ex+?@AD-KN-QTVXY[-]_-ikln-|,Ey+?@ACFGI-MP-VX-Z\\]_`bceghj-mortwx{}~,Ez+?B-EG-IK-MOQUWXZ-\\bfi-rt-wy-~,E{+?@B-DFGI-MO-QU-^`-bd-gkmoqstv-|~,E|+?@-DG-IKM-VX-Z\\^-`b-df-kn-prt-vxz|-~,E}+?@-BD-FIJN-Z\\-_a-eg-qstvwy-~,E~+@B-GI-OR-\\^a-lo-~,F?+?@-OQ-X[-ac-su-wy-~,F@+?@-JLMO-\\^-imp-svx-z|,FA+@A-CE-GJ-LN-PRVWYZ]-ioqs-uy}~,FB+CD-FHJ-VY[-]_-bdimo-uwy-{}~,FC+?@-GJ-NPQSVZ-df-mq-tv-~,FD+?@-CE-HJLN-Z\\^-bdh-ln-ps-vxz{}~,FE+?@-BD-HJ-MO-RT-VY-]`-fh-jl-qsu-wy-~,FF+?@AC-LN-RU-^`-ceg-ln-wy-~,FG+?@-DF-[]-fhjl-nq-sy{},FH+?@-EH-JM-PR-TVWY[]_b-dgi-loprsu-wz-|,FI+ABD-HKMOPR-]_-jmp-rty-~,FJ+?D-FH-KNPR-UWYZ,B?+?@A,?Av?J+HF,?AgB?+BD,A?SN|]A?+UeWX[\\,B?+STG-NUVOP,?Ap?B+Vv,AG+ufgPNihGvY,AIdAG+d_,AKQAIXAG+jm,AH+`KG,AG+|\\,AH+_mncd,AG+]ts,AX+A?,?AoA?+qr,ACBN{C?AcN~+_`,A?o?AfACUAW+ED,AV+JNMFE,AU+`_rq,A?zAE+QOPR,B?RAD+op-x#3$,AQ+GH-Z,AP+st-~,AQ+?@-F,AP+_`-h##,BG+_`-h##,AD+_`-j##,N{+@AB,N~dN{+DE-~,N|+?@-\\,N~bB@+@A-~,BA+?@-R#8$`-~,BB+?@-u#5$,?M+PQ-`b-h#5$p-~,?N+?@B-H#4$,Nw+tuxy~,Nx?Nw+|},Nx+@A-C##,Nw+z{vwp#rs#6$,?O+OP-T@U-n#12$o-t,?PP?O+uv-~,?P+?@-N#10$,?J+IJX,A?+RTdt,AC+DH,AE+UV-X,AG+T^b,AH+Qef,AI~AT+OP-r,AU+@A-NR-T{|,AV+ab-d,AWHAITB?+Q\\]#8$,?C@?B`?FM?B_?CR?Bh?CZ?Bg?Cj?Bl?FO?Bk?DL?Br?FQ?Bq?Dj?By?FS?Bx?F+UWY[,?B+{i,?HPM^F?D+CG,M^G?H`#1$BC+DE-h#18$,B?+`a-h,BIbBM+MN[-]`,BN+CMPQT,NwoN~+ac#,AC`BGp#A?O#0$BB{BA+Z[,BB+|},B?EBA+\\],Nx+HI-QS-VX-eg-j,M^+fg-r,B?F#10$AS+?@-~,AT+?@-J#12$,FJ+[\\^a-fijtux|-~,FK+?AC-HJ-LN-QSW-Y^_bce-glnoqrtuy-|,FL+?@-KMNPR-UW-^`-jmo-|~,FM+?@-BDEGIKLNOQ-TV-Y[-]_`b-giklps-uwx{-~,FN+@B-FJKMQ-WY-\\^`-cegi-km-pr-~,FO+?@ACFGJ-MP-X[-`bcfhjlnpqv-z|-~,FP+?A-SUW\\_-kmnp-tw-|~,FQ+AC-EG-IKLNP-Z\\^-ei-xz-~,FR+?@-PR-Z\\^`df-lo-rtw-},FS+?@-BD-KMOQS-VZ\\]_-cefimsux{|~,FT+@A-CEFHILO-RT-W\\-cf-hj-prt-vy-},FU+?@ACDF-IK-MORTWZ[]ae-iluvyz~,FV+?@EJKM-PRVXY[\\^-`dhk-nqrt-wyz|},FW+ACE-HJL-NP-SUY[-]`bfgkmnpquvx-z|,FX+@AC-JM-RTV-Z\\^-ac-ik-mo-vxy{~,FY+?@BDHIKLNOQSTVWY-bd-lnort-},FZ+?@B,DTIHW~D^BEKgDRMDSHDR?FYPFXKGS{F^mGH}FaLFGpHYWH]LEogDmHC~yEKHEYVDqwGByE`GGAmEWAFZMDFxETUFEkF~pGaCDAqDddEFIE}rGIlELKEHQDNlDOfFkEDDjFUcDvsEJSGvJH\\uEIIG?XD\\\\H[wF|aFGwFX|E^NFX}EPEC|oGsdEJ[FgVEUPFNlEOkEHrGGkHa@E\\~FHGEHmEJKC{sFRbDLIDI]FzIHAeDwmEaEEe[GE?FzPEbQFbDGYKHTPDALGocGJ]GB]DKDGcQDHdFZ+CFHJKRTXY[-]_-ce-lort-vyz|~,F[+?ABDEIKM-WZ-]`b-dfi-kmo-sxz|-~,F\\+AC-EG-NQ-X[,GUCHZxC~\\D_`HdpDm\\EI+pd,EYsGpxHqLFGEE\\nFaPEAqDLPDKVG}GGBKGs\\HQ`D?LFJGDcFEBjFCXGajDdSGJnE[kFkgDshFzvFSlErtGxeG~wH?{H{zEnSHCXFkSD|{FafGRUGS|En+TXU,Dw@DyFFVxHVlET\\D{ID~DG}^Db@GFAH@~HXZH]lG}xF{UGskEH@C}~DNWDL]G}+ghj,H@LE_FD|iGEWG`gHrUEEJDGjFWiD|kEUKE~QEzgDm}EPGDDtDEoE^CCwXFfHHd{FArF\\+\\]-_cfhil-wy-{,F]+@ABE-JNOR-]`bcegjl-npqsu-y{},F^+?@-KM-UW-Y\\-`c,FVDDxuFMzGN_EQlEJgHQtEraDLYDJBEONHRAFmSC{nDwZGGuGCUGEIEwcErIHhrELTDL[DRyG`dD^_CwLDwBEldFo~HBgE?UEReFK[Gb@E\\OEHLGsaF\\kGwhHFFD|hGN[GS`HcODNAGYTEmJEB+lg,F@~GJLGGpCzREqfGVNERLFrXEf|EZxGLHDMTFlUC}fDEKEtJDpAGxlENQDNHGK+ku,E^dFasEO|Dn^DqSDvmGnfEJEE^sGpyEO?EMyG\\HHeJGoVF{_HRqCyfHWOHacEWKFKUF^+egin-qstvx-{,F_+BC-GIJM-ORTXZ]_-acgijmnp-rtu|~,F`+@A-CEG-JLNPRSW-[]-hn-uw-z|-~,Fa+?@-B,D[yDo\\DwwHT~D@~GA_DMAET]FTDDSpD?`GuDEICHQ]E[\\DWqE|mDvaDOtFAQG|eEHnEQcEMbD|zE}GHBsGFbG}oDoWEXgD~pEqHHXGGu@G`kEQPFfoD^MEhXEGODPGCxWFgJEBhE}CGnYEH~H?]HiJFfcDOBFVsEK@DKXEp_G~^D{ZHhoG?zH|~C}GDoyGtcF~DEUdFA|DDDDEqGXjDsFDm_EI|HDkFTsGwKFg_EC@FlxCzFFzwF]DCwPGFlDG\\DFyEhpDMgGyFHSCHZNEz@HXcEdYFa+CDEGIJNOQS-UX\\]_aceg-nt-wy-|~,Fb+?A-CE-GK-NP-RU-WY-fh-jl-prtuwxz-~,Fc+?A-CE-K,F`?DAgF^VEOOGfeDcCENbDv\\Fh~Ec|C{_GGxDUWCwqFUmFiVDxaDyIHVnDGZDOxFAIELuHScD]AEWdEc~HEFDSFEvrFynG_aEGrFzoFUtGKgFb@HZKG}]EDGFRvGnLElcDGyGtOEk`G@iGPpDZpDKECzMCwZDFPFqVHEJFoFC~BGx~Fn`Fi[EPfDsSDAkGCEFW@FqxEvkF~_E\\PDlWDnwFbJEQmEOREMiEKjHSXEOlG}}FlSFWhEHRDcfDPEElxDAbEGsDweEmECzbGsvGaJD}DH?mFc+LM-QS-\\^-bd-rt-x|~,Fd+AB-DFI-QSTWX`bceh-kmo-uxz-~,Fe+ABE-HJ-MO-Q,E?_G?|EJDCwxDLTHBwEMwGBEEVeEomC|EEBmEv`Gn]D{xGZJD|REK`DDYGL`E`bDG?ELbGxGD?QDqZFdvDn{DGoFgzEA{H@RFZVD}+vV,FYCGxkF@nFXzFlHF]iDFrHARD_cC|MEzsG~iETKFkZFJCEucF~^Dj`EItDyTD[oGQAFkkDw\\D{^H?QF{SHa_EMAEzFFaWFAxDDwH\\ZD]jFStC|BFSwDyVEBeDd_Ev?Em~FaHDN{HZTDFJDG@EMHDOIHQRGoBGvKFGxFa^G\\uG~lGoLDN_Fe+RS-XZ-eg-qs-w{~,Ff+ACDFGIKM-ORSUVX-]_-adgikmp-vxy{}~,Fg+@CDF-IKN-RTUWXZ[,Cw@FZnDNmHQHH`uH{MHSlDmYGmaCw+a[,DEkGPbEFADIgE_JC}VE@jDEzEs]DD[EIUEUVHX`GpEH?VFVWHB|F\\bEnQFIIFJkGnzD_tF\\xGtKE\\[HT?GAYDyeEw`DeQFjnF^lHSzEmtEUlF{MD_EDDPHW^DnxDahDOgGxqETeH`~DZcHQ\\FZ}H@@EMFDREDc+Yy,D]ZGyqE[tGvyGGtDH@EBoD_TGZ}DrgHxDC~CHa\\GmxDgdE@uDMCEH{H@NHCAHd~E@hG?KDC~G?rDoSHdtEspCyKFg+\\^`ac-qs-uwy},Fh+?@-DF-OQ-UW-np-rtz-},Fi+ADFH-KM-ORSX-Z]`a,GsoDNPF|YFlNC{OCxNHW?ErTFNOGVhDwEFTiF~zEgIF^}HQQFx@DF`FBeDNLG~SGKBGshFInHdlErZD\\IGIrEUxGAiEG~HWqDegCz~Gm~FyyES}GNqH\\]DT`Hb]GAdDKiGn|DO_GAyDy^EqwGsxGIkHDYDOhEoZDGEFyvD\\^FCYEp}FqHDdJCz|D~~ECcFqiCwoDo@E]jG[ADroHSJHbMFUnFB|H?aDEnF{\\Gm|DdHDFcC|ZDOeDcjETvGAcDltEHuEJAG}ODxDEo^FkeC{NC~WE[LFi+bcfh-jm-qs-},Fj+?@-IK-TVWY-\\`acf-kmo-wz{},Fk+?@ADFHK-MOQRU-WY[\\^`-bfhl,EtmEuiFeNGapD{VFSjEIYG}DC~nHF[EUfGCnGDPDy[GDOGtsDHnGeEGtJDcLDADCzWHW[FGuGDxGs^DnKGmbHXCDeFF{YDQODXuDWMGndESxEeAHQXFZUEyHDxqFSWE\\EE^PFj~GA\\GtuEC^FfEETaGtbDEGDGYHQaF{wGAZFyqDqVEwnE\\_FnXFYJHjWGENF}SFrTEO]HTOFg~DPIDRdElKEO@EGGHw|GBrFUXDHqH\\hGPZE_{GZcHW@HYSHRkCwiDOCFzXE_xGv^G?TEZsDyYF}xFk+noqs-vxz|~,Fl+?@-CEGILMRTVX[]^`b-lnorsuwy{|~,Fm+@A-CE-KMNP-RUW-Z]-_b-dm-oqrt-vx-~,Fn+?A-C,D^AG?~EaVDvdESzDI^E@lH}YC}ZGykDDkDmjD{RDvhEp]EJpGs`DDpHQhDJ}Eq^GJ^FJVD]aE]CGslDc^G}[GNFDQTFmLC{oEq|DlcDfPH{RDNcGZIHigGovGA`ETDH`}DZyHZFDGmFR[DHODn`EKAGcACxUEJOE?iEbyDDrDmWDE_GfAFm`HeEF|OEBnF@KGsnDDHDx~H?ZFPoGfCD[lF`DD|QH}^HVyG|gHk{Gn`FXwE`AE^[GviGstDG|G}IEzYEbLHSDHBlDZ|E][GbxG~FDRGFn+DG-JL-OQS-WZ[]-_a-cf-hj-lnoq-uw-z|~,Fo+?@-EG-ILMO-TV-]_-dghj-vx-},FpAHiwDlhEtvEoeCydDmrHiFHDbEEgHAnH^hDOjEutDnQDF|DUIF|TF~oEQ{ELLEVpEE}EALFCIEp+VH,DcnE\\lGGiDbTDYMGpiEnjHB\\Dd|G?VDNvEthDPtDU\\GLvGNNE_wFe}DQKC|TDOGFZQGqHHWAEqrEuwGtjGcOHxcGsyDW~HzPFVTD}GFJ_E@gDR{CygEgiG``E@QG|oDRCFBWGXxHw~EsiDmND{WFyaDUHC}nFKsDO{DMYD?XDOMDP{CxMD~|FPYDbuGPjGB`G\\sFJOFrIExUFp+BC-KM-qt-y}~,Fq+?@-GI-ORSUX-Z_`be-hj-lnos-wyz,D{fGXMDSkEIcCyQEqiEGvGIpDRVDLMFK}EzPFSzDGQDKUGn\\EfOD}IE??EvmD\\NEkaFMnE`RG~WF{RELaEAbDScFViGpaFCTEubDmeDxzGLQEDKHzCFbyG\\VFofFYFDFoEBuFDKEXBDxKE@LGoMF@oEKdG}HD}|E@aGZSDZ]En@EASEDfDLHEB_EXeGs~Ff|C{YFBhEpFGmrGnqFzWGLcEWNDhYHlAEtPEvvGp@EszC{XF@jGMvEGUEBPH[LGsfFdwDFzD[}D^yE[yFTwFg|FfnFmTFq~Fr+?A-CEHJM-SWYZ\\]`-fh-mo-vxy{-~,Fs+?@-HJ-^`b-eg-ik-mo-u,GAKHddG~xE~?GmdHw`DfkFzhF{HDOHE]@EbWG}PFpLHZEDNIE?dFU}EpqDLrDjHFyfEKcDF_GCIDvpGR^EI?DE?DlbC{MFdlDHAEAwEtMDn+CA,Gm+`o,EVaD~KHXDDeRFzfFyiDWHE]vDcxC|rDmuDI_GLYHaIGs}FSqHQ}D@FFg{CzvE]uHh}Dj@El{FZPD\\YDoUFkyHVsFDMDD{GAhGHoDdwF{CGKfEb?E^kFapF`vEJbEL`Fm?C~lDHiDFNGLOEfZHHsGvtGspGf@HSmFmlCzuFs+vw-~,Ft+?@-ln-uw-~,Fu+?@-W,D@dGGoDHPHdnEwOEyDEufDzyDBtDf[DoEEtEEp^FUEGQJE`gDdUGmqDK_HDpHXLGTHEcQFc@FCeGBuCycHBIEtFHiCDgFDY{EODHRoF^jC}dGCYFJ`GfQHdyF{sFz]DH~ETXHDtG|~G}BDNjFiUENlEMdFYEFfwG`VHWuEGiDIjGIAE`SE\\oELvF\\jFjlEs@FzRGfbDfOEGQGVHGIdFTKD?^CzJFUdGnjDpIDv}FlJEUcHFPCzIEsdGd^FsfHSeCzDGogG~ZH\\rEXJFe@G~PFBkEtwFu+XY-df-ln-~,Fv+?@-y,Do|DIqGLEDDaGKMF\\ZEXuHqwCykEBIFq+}r,FzNCyTGleEXnHaGH\\XDaBETkHT[D}CFVHH\\UFj+^],DF?FAnFiWENiFhuFy_FMUH^lCxDF@wCx\\HDQDMhETPEVfGF{GGDDQMDopFUYH]_EJWFJXFU|DpDHhxGNIDp?DQ?F^hCw}EqmG@YEJQELmDvgDDvGv\\Gw]HSnC~pDNdEBfFAkDHfELOHxBDg^D?eF[vDLvFzaEQDESjEIHEMWD?SFGtGfHDErGn?Fz\\D\\FGNKHQfDEZDOZDrzFv+z{-~,Fw+?@-y{-~,Fx+?A-EG-\\,C~IFjbEtYHB`HiNDU?DQUDL`DQnD{?ENhEdvDFnEDgDGID_iDJWD\\MF_LF[JDyvEDvFr_EHZEIVCyaFATG?BEJvFBcH\\_D\\vGJZE^nEbtFbTHaVFfPDbrDQrDNnEwsDDJDGzDmaGn}GAnDTBD]eE@rD\\PDOlFhyE@ODlSEMfEI_DNbEHbDnFE]nDRlFi^GJeHDvDyRGbcDcwD]mEKMGvgGBnD\\VFlvC}hD~jDm|Ek}DK`FlOFJAE`EF^~F[uEVvDEtCyNFZSDq~FidGPtDdMHl@DA?Fx+]^-~,Fy+?@B-Y[-]msz{,Fz+Uckx,F{+IO]vxz-~,F|+?@BE-NQR,HeGECfEyBD\\cEWEELEDZoEJkEHhDzRHWSD]BEJHDUFG[`GDIG}bDTeGMpE\\dGtUGR\\DhiE_NEJeFnmHWPDDoE}[GooEN|GfGEFQF{EFBAEzdFODEeSFJ{DzIHBME[VEtiEL]DIrFHaG?@C|kDfdHDiFBXEu\\DJQCxOHZvHTlGT}FbIFsnDC`D]QERAGAJFpzEriEbpEd]DEvDMWEagFI@HzMFnpFJwFezE{RFOEE\\MHFKHqcFc{GMHGLSDONE_VCw|DMHDIpF_}DMEDGhDAGC}JC~OF|+UXZ-]_b-fj-lnort-wy-|~,F}+?A-HJLN-RT-XZ[_abdeg-mpr-vyz},F~+?A-CE-HJLN-RUVX-]ab,FVaFjJFqQEqdHYuDIZFQBDRhC~hG@SGMqG~]HToDzHE?[Eu^DwWETZGCwHR}E@JFA{FzBFqmDFHEa@FqpGHnCwcG}EHFNEX}CymGoDEQhG@IDBYFUVFFMDndG}|E|eCyEEQAHTbDzUEUXDGVGbAFBGDIbFKMFOrE]VFbvH[UCwsHAzHr]EvJDFZGt@DO\\EJMFMqGNpHZuH}CHRBC{uF}YDFKF@tHXtDqlHaEDNeCzcEy[FOHEesF`jHeNFTXDGWFWcEt@E^rDDlH}XG@JDQXFk{Fi~F~+cfgi-lnqs-y|-~,G?+AF-IMNPRYZ\\-^`bcj-oqsxy{},G@+?@CDF-HM-PRT-VXZ-gj-oq-|,HYED]CEJaHXFEd{DgCEOAFnRE{NHXJGIeDLaHaDDyOFAHEMrDLcGXNHq@HyRFaKH[qGvnGtAHx~E|]FeCD|THXEEGmHhsDOTHR\\C}bEVDDp+d`,F{TGXPEonD}JFMFEzcFz~DreEKZDliEzeDLtCxpEM_FTdEI`G|mC{eCzPEqeFyuGmyGO\\G]yF|VH?zHSbFmhHi`GbwGO|EsZHiEFz[DeGHyzFMZF_@GYAHhkHiADWZDOVD^JCxoHyeDLUG~GGCHF]QHeQGZmEz`GSREZ{EDaE{jG@}GA+@ADGIL-QSTVX]be-gkortuwxz,GB+DF-JN-TW^_abemtvxz}~,GC+?@B-DFGJKTVXZ-\\^-jlmor-tvx-|~,GohGIQGKjFZqEoRD~XGM|FKjGKDHSYEnZF^ZHREDLnGKADEQDw|GqKGswCxGFMjE]YEaDHDuH[HFDcEq`F[HDiQHT@EnNF}MEWfDnODexDiYHV+gv,CzkGOKGQXEikFZ^HSoFKZEaeDl^F[nHEYH\\`Fr[G~vGo[D{dFprFfWGfDErKG[[DnEDxAEbHF[_FztDETDDLDJHDghF{DH\\aGJVENNF]CGVOFfQEwyDyXDeXGSPF@lEoPEI~FY~ETNEAnHV|EWMG]^HwbHRlDOLDP|GokEPwGD+?@-DFHL-NQU-WZ-^`-cegi-knqrt-w,GE+@B-FHJ-MOQ-VXY]-acdfhj-qs-x{-~,GF+CDF-HJL-R,EPxGWPEg`GE[FbgEPhHlSEIxE[jGMjDagHzWEqjE{_Dn]HXKGoJFH^E^OEJFFH`CyhDfEEnLDaREYmDxTDJ^EDTE[gFZmF\\eFHfFhEEJ~DRiDPOHQ_HAbDg[FyrEoUCxBDduG?ODdGDLVFSvHY}DZIEK_GCPE@{HVxEvUDPaHe@DEDDjhGB|DemH[RD?iErdDo{EJ^C|_DK~GDzH?EEyyGSjEJGDxsFa}EQtELzD~tDgWHD~Hw^Do~ELNG@ADl|DTmHT+IL,EuDEAgE^_FJ]DF\\Dm@GF+ST-ac-eghjm-qt-y|~,GG+BF-JMNPRT-Y\\_c-fhmqy{|~,GH+?@-BDEGIK-MO-VXZ-]_-fh,EJfEr]FHZEHlHQmFy|GCREtRDE[D{CDdsDIiE?QDdrEYUGXOFU^EKiEFeFrnGnyDReEkfHwdEmsGVTDPTD@uEqcDTiGusFGkDwTE?TFOuEJLEMQFHKD}WExBEs}ES?E|WFZWFbOFZ{FTSDGcDNZCxRDy]EV@G?iGBUEIZDQEDGgFAmGaLGvPEr`DPwGBYD^xGbsGtSHXiHDLC|hEqZDUvFZEF_oEIgFBxE}MD|lGRkEbYF`{FnvGEgE[JHxNELfFaoD\\nF_QH[xEHxEIjDIGFOtEnVGH+ij-lpt-wz{,GI+?@BD-FHKOR-UYZ]_abfqtuy-{~,GJ+?ABDEHOUXY\\af-ik-moqrtuwy{-~,GK+?IJLOQRUWX\\-ehimoqvz|,DTcGC}FUqFYmDKxFV]DBzDp@GlkFnFD@NFHFHiVHbWE{AFRaFdgEQFF]dEJ{HaPGsjDR@G@WCxQD\\iGJxGOLDxrDFlFRuGnCDpND\\`Er{HaFDhEF_sHlCG~jFqTDHUEHPHRyCzEGMEGP`GNhGQqD^SE[sD[BEXmEteGopEZ\\F?PE[^EkyE_UEGYDezCwBDFCE{EE^QEqNDDuEbJDdFElfFTeDsMGCOH|OEVVFd+G@,HiPGtvDqACx]C{@DOnDdPF_KDXgEoSG~CD{BEp|ErbGmjEMOGK+}~,GL+@ACDGI-MRT-X\\ao-uxy}~,GM+?@-CFGI-LN-PS-VXY\\^`-fk-ntz}~,GN+ABCEGHJLMO-RTVX-Z]a-ce-gj-l,E@oEs|FHtEHeHQMHRDDLBG~@Fl}Cz^GoeCx}HzSHQ+pr,DHLE|[H@bEtDGosD_PDtKEk_ElHE]iDPZGDSF}KDaXGSvD{yEIaEhFHSxETqEACE`dF]fCxSC}gDvfH]WEQkF~WDrlC~NFiLDGFGKCCwSE?nFiBHQeC}tCyqFfeFOsDJcGIxERQFe|Dn\\Eq@H\\QG|zEoaD?}DL~EwDERMEXsEooEBDH`vGnvDyEFO{FhvFfJCwWHApFOBEpADZYHDJErDGuJDKyGZEEZqGynDpGHhpEw_GN+mnr-vy-{}~,GO+?ADF-IOQ-VX-Z]-bh-oq-vx-z}~,GP+?@-DF-OQ-UW\\-_ac-gim-oqsvxz{,DNUDguH}JGubDMzD[GHafE\\BHEZErHDDgFVIEJrFIkDGwDI\\F{yFASFWwDLsHxIEevF`mHZ?GbXF}cFCuFFBDEHE^RFRcDbcESWDYvGmhHduEHoFzTEBxFBlDbkCz@CyyD~LH^fCzzGmcDGBDeIFyjEHSCzLEVdEGMGKwGRHGLbG]LFESEyuDmxFzQDEVENHE^SGAHGKxG_TDCQDlyDeAG}pCxrEp\\DDdGcdG|nHWmGTIFP]HSOHVoEueGJdD{pEQQEsQGOgGDmHrBD`]GtZCwHDN@GP+|}~,GQ+?@B-EILN-UWYZ\\-_a-moprt-vz{},GR+?ABD-GJKMNQSTV-[]`acf-jl-np-z|},GS+?@A,C{]ETbE`PDVRCwfEOSHiYEHjDjAFP^GHqEuhEbmDBfGMMF_AE\\?DGxEqXFypDAzDTdFD]FlZEXQFNIGJjE\\HDppDG_FD|G`jHViHXTERDGt`GErDUCEpTEHFF{mDaQC{cDTEGtNEXKCwIDoYGbrEaaELMFgLFBfGILDJyH^uDoPDRgHAtFzLDdaGtIGZFGG+KL,GteEPCDoCEDPEuHFc}Gm}F_vFSrDPzC{wGyjEvpDg_FzDFd]EqGDm`DhuFSYGA}EDMEwVDboFS+^d,FHqDLFFzrGS+BC-JL-OQS-UWXZ-]_a-il-u}~,GT+?@AC-FJ-TVWY-\\^-bd-fh-prt-w{|~,GU+?@,F[@FZZDHhGB[D[bDwGDcpFJmEU|Ex~GnVDowGXpDL@F^rEJ}EVuCz?Hb^GY?Dm]GnEDNqF^aC|~DpMHhuDfJD{NFcyDbjCwUE^~CyJEJlGiRH?\\DI~EWnDV[DXkH?ACzTC}LHFIHdoEoNDwAE@BDmcGfEGnTESuEHJHeUDmGDn~EMGDSmDNVFWeDD|GSkE]aEarEmIEIQG}RDNSGGQEvPFUNCxeGtMDloFE^GUnEYPEZXF|qG[?HzLH{_Dp]E[nG~oE_PE\\^EGLFjUDaDDyuEToE{pGU+ABEG-MO-Y\\-bd-fhj-lp-uwy-~,GV+?A-GI-MPQSU-Z\\-bd-gi-w,E@TDGvG?LEPSG`oFShDwDE_REJsH[[DNKFG|Go@EosF\\`FgMDOmF]kH`yGG[GnsF`TE[SFB@EUnEQTDWuE?\\Ff@DNwCw\\ElzGAEDnyDVbDZZC{+y{,HdqDvrE\\}G?wE?AHaAH?@DmJGm{GntEO[GHWER]DV|GJNHDdC~VFs_H?^Fq^DBrD`PEynDm~GnHGABHDwGQ[FmVGX|HY+JN,FzdHjRFaMDq@FhVH@AHYfFd^DlXEL^FkJGRPEalDSEF{hFOOFsaHS@EH?D`KCzUDmBDdxD`SGV+xy{-},GW+?@-CE-OQ-TV-egi-vx-z|-~,GX+?@-KQRT-XZ-\\^-`b-i,FLlEK]GxJGwNGBMGJSEIkDNoEroHD]DciE?@EpoD\\LEPIGsiFWjEzhD\\ZEi?FVoE|lGo+lG,D\\eEnnGaQFarEMaDNxFAlEpcD`WEOiD_AEb_GEZDSOFrUD?WGyyEvKGu^FBjEMNEuZEzSFzeGOCE`BH?BEvWHXuGmgDdVFHxGVcGD}FU{GiIEanDHSGwaHSPENOHaWGxCDT{C|REZ~DYNEBTEuTDHBDpHDchEvzD`jFS+o[,E@kGGSGDEEKPE\\`G~aF[yGvrGssHR@DwUDMDDOkFBBGX+lnoq-w,GY+BC-HM-QSU-Z]-adejlmqrv-xz-~,GZ+@ABDGKLQRT-VY[\\_-bd-gi-knt-vy-|~,G[+@C-EJKM-PSU,Ep?DzvD@[CylDylEKyGHFH?YE`OHDmF]rDOKHR[D|cFjdE`uELDFlQFz^FVZD@vEITDcsH?NDFwFfBFi@DZ}D}QH?SEuADp_D[^DOODDSExLDZaEMgHaRGD~G[TGciH??DO]DpnGF?EJUEHWGCpHwtHX?Hh+m{,EclDedEJRDS}EKUDRFGZXEs{DgBFReGa[EliDcUGpKD{nEx}FMhH`|CwwFBvDmKFaVEK|EXYFYUEBJDmZDhHCwFGDTEpiFMJCy`E]HF|PD}?EVyE[ZD~WDeCDg@G[+XZ\\^_ce-gi-lnoqrtuw-y{|,G\\+?@-EIJLN-QS-UWY-^`ae-lnp-rtv-y~,G]+?@CEFHIKM-QS-UW-]_-c,DvLD}mDLpH^eG~\\E`DDZsDSnEB^CwyE|LFzsGJFGOMDfSC{+^i,Do}FykE[iGSYDPrFTNGBBDUAHlNC|LEwlGoRDoHEDoDLjFW^EwhGYIEUFHVzFyxDOzFgrFsIHVmDV`F~@FRmEK\\G[VEu`Fi\\EGPEU`DLfEN`EqBDvjDP[HQgCxKEp`GnkDpJEV_GI[EafDO+}s,EnJEleCySELADLGGG]C{LC}mD\\]EGIHZ}EXcFHhDJ~DI`EA^GnnEWSFEXE]OGd~F`QF^|EXoDWzDOwHS`FHyG]+defhimo-qsu-xz{}~,G^+@A-DF-HK-OS-Y[-^`-ce-hj-ln-wy-|~,G_+?@AC-HJ-QSV-Y[-_b,Fg?E@nDwKEAHGE\\DcTEB[FECFBnEyiEpOFI?EiCGalDwlCx_DirDU[HRbEsVFrzHYXEGNFzEF]MGX}DKbH[]G}UEYFDr`C}_FJlCwJDMeDcNDOREM?HSgDDGCzXHq[FycDQwGscG`SGGvHVqEuMD{eDjKEW}HXhFMoFKmDM~GDyHeDF}`DmiHX+vO,Fy~FZwDMaHTuHeXFmpGdCExWCx`F~SFddGneEBrDRLCyjH`xDvvEh`DBNDOPGp`GOfF`\\H[CDHIDRmDYbHS?EuGDmtEvEEXRG_+cd-pr-wyz|-~,G`+@ABE-JM-RTUWY-_efilnpr-uw-{,Ga+?BEFHIKM-PR-TV-Z\\-`bd-i,DoNDl\\E_`GAUDTwFkPETGEdSCyZElFG\\MH]JDLNEK^EOyHAiEU[GB@GoODEXEaoDLwG^xEFGEr+Cz,GoaDpPGUiGInHSKEkbG}ZEUoD~+zB,C~`G`DEW^GDdFKhEByDDsDGPD]JD|aHAaG`KHEQDxwE\\NE?fDfRDDCDFuGBwDKGEpxHZCFEIC{PC~mF}]E[|DVDHSGFf?GaUFzbDa^EGKH[?GXYDWWH`zD}OGmwGRCHDVDNXEVlDyNFT[E@cFtmDh~Fz+il,G|hDUfDmbEAkEVJFMCGa+km-oq-uw-z|-~,Gb+?BCFGI-LN-PRUVY-]_`efh-nqt-vyz|~,Gc+?@B-HJ-NPS-W[-_a-ce-hk-np-rtv,H?HFXbF[hFzYH\\sGUZDleFhsHZiG`?DJJFEND}iEVkGnaDnzHhnDv`EmHEpZGm+ln,H?IG~DDMJEI{Hw+el,DP?CwjGI|FHXGY[DsUG`XEunHZDDRPCyYGmuFCHDQ|HWHFB^EvxFZOCwdF_SG[QDqhDzuGg?Ha[HWMFAMEq~DdCEMhF[{G`LE{SGHrD_oFFTDMKF_YHZ@DS@D|eFCoDmsGoYHiKEmBDcmHwnFffE\\gEHkC|nFU`F}IEsJHWrEofCzoFVQDDzE_vE{}HA?GDoDeUFPuGc+wx-~,Gd+?ABD-\\_-df-y{-},Ge+?ACDF-`,EPFDofH@dFiPGobDfYDQkGG?GLnGe@G??EcoDXMG?uFGvHFMDEuCx^H`tEMUCwYDNuEZrGDJDc[EuqCw?DbxDKzENUHRpC}\\C{IG`bHaODcvH@VFfzCziGBoFUPEqADm[DfgD|\\EcDGY@D?YDvqCxXF^bCzdGHyEIPEWRHAPDpxCy~D|xGFEH?wGACFUjCyeGbSECNEnDD~ECxHFZIEyaGnbGmmGoIGnPD{AF~+{K,FzMGKtGLjDZ_EmvH^rHWsDfzDO^HRuEvjDnDHdmDoxD{THYOGe+ab-~,Gf+?BLR-TV-XZ\\^-acf-ik-mo-qs-~,Gg+@A-EG-\\,DLoGJpEgpDhsHxoDySF{gGMxGO+cd,GLfG\\FG~MGtaFZGD|pHaUF`kEW_DR^EJdC|bGFBFVGDywHZLGwIGZxDQNErrEuKEowE@~DJFFSgDx|C{WEA_D~fDocFSpHAmHR?FIxEqxEwwHDHE[HDN+Jr,C|PHFHGnpDNGDx{G~AEvcCyMFZAEeEGX]ECYGGEC|XC~]H?}Hp{ECHEw+\\S,HYDCyGDgpHZgCwMDp~FexDmFGnlF}|FMHD^^GIJHB@DO@H@FDUzDriD}`ECGEkqFJpGAqGiHGg+]^-|~,Gh+?@-FH-wy-~,Gi?EtsDnRGbTHaCGpjHhlHwrEwIDEcDDBD]bGa@DM^ENsG}TDZlDPWD[EFK~EyOF{WG~[GJPEC~E?gHXaEZoFyeGuIGvBHQdDqrFqcE[GEAeHWDG?WCyPHBfDK?HXgDD@G~OGTsHD\\EXTH^tDlTDK\\F_wE\\AE_|DRHF@}DmoG||DELD[gDQpESQEYAGt+]B,GCNGPkH@lFr^DF~GVzE]bEVhE}`GYcGy@DXiH?_FYAF@uFFdGsbEJhDGXEr|Gs{E?MDa]EEMEZ}Gt_EHMDUrEwbE[lG|fGi+@A-GJ-QS-~,Gj+?@-b,HR`HVwF[gE_DEegDQJCxLFAwGnGEPWEUJDmDFiCD?yDngF]zEn`GhxFqWEq}FZNEUhG}VDslDpTGWwE_GDL_EGWFjXExZFz|Eg^Fj_D|oE{rD{_EMKEugE\\UCwGDwOGseCzVGB?FWsHY[EJZEWlEH}Eq{GttFDfF|hDDEGAFDNkH@mEIWDRqGZoG}XG?DHSVGSVG~XEtXFNLEU^F[^FSCF_fGFzGs]HQGC}eE]TFUxGnIH[FEKnHTFHWtGQwEKbF\\@D}@FJoCyHE?SETsEJnElbES~Gj+cd-~,Gk+?@-EG-df-~,Gl+?@-D,DwfFVFHBPGn@GI\\E]\\ESnDOpG[WF^dGAaGCAEp@CxJFzFG@KFZsEcLEmUEHfD?{C}CD\\?EKFElaGu}DNiEVgFywD~VEKYEMvGF+rs,F|mDw[DrXDGuEXyFfhFgYGsgFAXFVSEz]EqzFiQCwlFZDD~_HQ^G`vFzGFfLGA~HFLCzqC{VGG^DPgDv]EsqGnKFqdG|sGAWDwYDQQFYpDmXEW{HicFN_E_iGZZE[pFKiGn+wZ,H?OFjxFBZFDmEJCF]hDWpCwzGPVE^pDIhGZ?GsmHRwFlPGl+EF-df-jl-~,Gm+?@-^kpz,Gn+FOi,Go+H],C|NErgFd\\HhzEIRFGiEJ|CwRF_UG|kEQoGtYFnEE`hDyCGbDDeEEQ]DbmFIuEcMHSdG~|GtWD\\_F{?GoEDFEELHEJXDLRE`KFOaGK@HDKDTCF\\?F@{EtIDDxDQgGtCDf~EzJEvCDl[FsjCzSFp|EzRDlOGFiEwLDlVHkBEbTGwiDmVFz{E?zFytHAxGtoDdNENLFf^GurDLQEVNFdUGnDHWzFzCHQzFyADWsHEHE[?F|iDoIH@tEWgDveC|OE^]D@YC|[D\\ODyf#2$Go+wx-~,Gp+?A-DGIJL-SU-XZ-_b-hk-qs-vz-~,Gq+?@BCE-GJL-RT-VX-l,CyLCwKDD?CwODz~DLDCwTCyWCw]HkqDlkDXhCwgFeyCw~DKTCxFDclFGzDLmEoODZ^GBcHeVEnRF\\}H{VCwuCy^H{OCx+[h,CyRGIGDlZDTkDWNCzCDM+L\\bdm,H\\dGt\\DKYDNtDK+em},Gt[DL+eb,DG+AGMlr~,DH+?K]`[,GQnDH|DI+A@OR,DEAF|SCyzCz+BHAg`j],C{ZCzrC{aC|cCztC{+dfHj,C|+]f,ESwC|+Y\\,Gq+mn-~,Gr+?@-~,Gs+?@-L,C|+^V,C{+q|,C|+us,C}+PHBN,C|+}z,C}iC|{C}+kS,C~+egiDYb[P^w,D?hD@KC~rD?+kNml,C~}D?+[Kdg,D@+}BTGMkz,DA+dfhy,DBUDCEDB+lkem,DC+FJ,Cz\\Eo|C|+Wd,C~MH}_EpEFpsDDmDv|HzHHeWDE@DcSDJxDKLGgFDKODFjDcXDDTCy_DDUCyrG`mGacCytGCSGbQFe?DksG_BF}wDE+jp|{,Gs+MN-[_,Gt+PQV^dg-ikmnpqw-~,Gu+?ABE-HK-OQRT-]_-ac-oquvxz|,Gv+?@ADF-ILOQ-S,DFFDE+Uad,Gm+_efistv,Gn+ABJNMQ-SUWX[^_cghmorux{~,Go+?ACFKNPQS-UXZW\\^-`dfijmnqrtu,DL+hy,HW+\\a`pi|{,HX+AHS^fkqs,HY+GLVo,HA+VZ\\Xk`sruy,Gv+TWX[_-ad-fhlmo-qsu{}~,Gw+?@-CE-GJLMO-RT-[_`c-gjloq-su-wz{}~,Gx+BDEK-OR-WY-dfgijmp,HA+wo,HB+ND,HA}HB+OCFRea[VZjn},HC+Ca]bpnx,HD+BE,DGLDdADI+akl},DR~DJ+OUo,DN^FFmF^LDzsDF+t{,HknDMuD{@FTYDvnD\\KD]+h`,D`}Da{Db+DP,D[+hkirxmn,D\\[D[zD\\+Ah,D]DD\\jD]ED\\+{zglur,D]+lcKq,D^ND]+fsR_,D^+TWYXQ,D]wD^+snwc\\,Gx+rtv-z|},Gy+?A-CEG-MP-RT-Z\\^-ilmopr-xz-~,Gz+?@-LN-c,D_+JL,D^+|l,D_+?]X,D`CD__D`+dk,Da+@HY?,HegH{XEF~GH+x|~,GI+NIgCMPVXjw}o,GJ+GIb,GI+Wvm,GJ+JK@,GI+hs`i^,GJ+CM,GIcGJ`GKHGJ+vc,GK+NF,GJ+[sQW,GKKGJ+zR,GK+PYEST,GJ+_T,GK[GL+PZ[,GKGGMQGK+{sp,GMZGL]GKnGL+NFB^?,GKVGL_GK+lyr,GL+ed,Gz+de-~,G{+?@-~,G|+?@-C,GLgGKZGL+hkilm,GMoGLwGM+rs_iR[D,GL{GM+uh,GL|GMwGLzGM+W]gy{,GN@GO@GN+dW,D_FGO+WJ,GN+\\|U,GO+[wPE,GN+S^,GO+NB,GN+wxiD?,GOeGN+o`,GP+[PYXr,GQ+FG,GPyGQHGPwGO{GP+Ehu,GQ+KM,GOpGPlGR+@LOe,GQ|GR+RI,GQ+~y,GR_GQ+`xsV,GR+db,GSKFSLGSwGRoGS+x^y,G|+DE-di,G}+?KQ\\_-ac-fik-nq-tvwy-{~,G~+?BEH-LNQUVY_`bfknpqs-uy-{}~,H?+FGKMRTW,GTUGSzGR+~{,GT+XGgc]y,F]aGT+Bqz,GU+cgFN,GTxGU+m[Dxvo,GV+R@[~,GW+fDhU{,Dz}D{GDc{Dd@G?vDd+TYW,DKNDo+adks,EH+Ki,EI+^z,EJ+IYVm,EKaEJuEKxEL+JB,EMlENuEL+py,EM+Ms,ELlEM+kI,ELhEM+m{,EN+qw_~C]M,EPQENEEM}EP+D@,EO+JZ_Ke`,EP]EQCEPlEQUH?+X[b-df-ko-svxy|~,H@+?BDEG-KMS-UXY[-`cefh-kn-ru-{},HA+@C-FHIK-OQSUWY[]-_cdf-hjlqv{|~,HB?EPyEQ+vwXy,ER+?OVca,ES+Hdm,D{JD~QFSXD{PDL^DN+p|hgz,DO+QUE,DP+JQ-SUB,DO`DP+VX,DO+bq,DQ+AS,DP+vpc,DQ+YZC,DP+ue,DQ\\DRODQlDRADQsDRQDQ+fe,DR+RS,DPqDQbDRTDQ+z~,DR+KXY[,DQ+hic,DR+\\N],DSZDRfDS_DR|DSSDRrDS+abNPfi,DTfDU+Nt,DT+Hl@T,DS~DTODS{HB+ABEGHJ-LQS-UW-Y]-_b-dhikmo-rt-vx-{~,HC+?@BD-WY-\\^-`c-moq-wy-~,HD+?@AC,DSvDT+Ut-v,DS+ro,DT[DUJDVQDU+BpxG@^,DT}DVUDUPDTzDV^DU+|}SX,DV+ivH,DW^DV+PjkSe\\CndqrKLgtc,G}SDW+]GK@cb,DV}DW+?fl,DXWDWxDXVDWkDX+LaX[KS,DYEDX+cpjz{,DY+DRn,DZ+SV\\`tjx~,D[+CIH[,Dw+NXSPpz{,HD+DFGPR-UWXZ[^_e-gjlry-{,HE+?@-CEGIMNR-X[-`c-hjko-ru-xz-~,HF+?@-EGJOQ-Z\\-d,DwvDx+CSZ]`,DqKDpyDq+LOUGWXPY[ta|kjpb,Dr@DqvDr+CQcJd,Ds+ABfemc]EZ,DtWDs+}s|,Dt+kZn\\jJIhs,Du+AX\\,GprDuvDvDD|+rv,D}+AFHKTX[glt{,G`aD|`FI+losvw,FJ+B@MLQgnhqsv,FK@FJrFKBFJyHF+ef-~,HG+?@-~,HH+?@-D,FJzFK+VR`I]\\Taxdkwp,FL+OLV_kn},GGZDcdHbfDc+cA,Hd+bf-ksv|,He+?CFILOPR-T,Dy+?PJUd_xt}r,GtRDz+QPZgi,GEyD~+CHUN,E?BD~mE?CD~+`c},E?+DE,D~+ilw,E?+XteZNLhjI~`,E@+wxzyA,HH+EF-rt-~,HI+?@-LN-f,E@+i|,EA+UYl\\BQKZ,EBkEA+zp,EB+\\WEY,EAsEC+_eTb,EBsEC+?Mj,ED+It,EE+kSfv,EF+St,D~\\HYrHV+hjprtu{},HW+BCEGI-LNQT-VXY,CwkFG~EGTEotEp+S[I,Eq+bDOSK,Ep+ghsu,Eq+Eh,Er+OS,EqlEr+vwpV,EqqEr+_Uyjm,EqpEr+Rn},HI+gh-ln-~,HJ+?@-FH-~,HK+?@-H,Es+xfK,Et+BG,Es+FCXMj,EtLEs+mtY,Et+NQS,EsrEuPEtnEu+]_,Et]Eu+RS,Et+[_{b,EwYEv+FD],EwMEu~Ev_EwPEv+e\\X,EwUEujEwKEumEwjEx+mMj,EyqEx^EyEEx+RS,Ew+qd,ExCEz^Ey+pW,Ez_E{lEzaEy+df|zv,EzVEysEzNEyNEzAEy^E|+aEF,E{+cT,EzxE{+nu,E|+Js,E{+iHh,E}+HLK,E|+wq{y,E~PHK+IJ-|~,HL+?@-hj,E~HE}+fxu,E~+A`m]_n,F?+YbZxt,F@+N],Dm+?CTRdw,FSnHi]EOsDn+cm,GcoDnoGxFGkFG}uG~+RTdmcherg,H?+DCJePLU`tuln,H@+CPQOgWaZ,EYxH@+s|,HA+AGBJ,D|+OVUW,DozDQjDp+OX,DlpDp+be,F}{D{+ihl,GHsD{{HkzDpmDe+@BLhib,HL+kl-~,HM+?@-MO-~,HN+?@-HJ-L,DeVDfIDe+j]c,DfQDe+qn,DfVDe}Dg+DE,Df\\DgGDf+bWx,Dg+KHqsPbR,Dh+?fIT,Dg{Dh+at,GBkDi+iZ,Dh+vy,Di}DjjDiqDj+QS,DiwDj+_bpUeW[,Dk+HVUqv,Dl?Do+T[,Dl+YdrPRa,Hh+tvwy~|,Hi+?@DGIOQRUWZ-\\^_abdf,Fy+^`bdgh,HN+MN-TV-~,HO+?@-m,Fy+lo},Fz+?@AHJKOSVZ_`gjmnpq,F{LFz+uyz},F{+@ABFGJKNPQVX[Z^`-fi-ln-rt,DxyFT~DvZFS}HATFM+MPma^,FN+NAP,FM+vr,FN+?HGdX,H`{FOIFN+hf],FMyFNqFO+Ni,FPZFO+edgomk,HO+no-|~,HP+?@-ik-~,HQ+?@-CPUW,HR+FNRSYez,HS+[_,FO+ZY,FP+@[VTXvl},FQ+[M?@FJ]ghOf,FRQFQyH^+ijk,E\\+KR]Gh,E]+dF,E\\+ir,E]+Wf,E\\tE]+g]lJ,E\\+v{,E^oE_HE^WE_IE^hE]oE_KE^XE]tE^YE]rE^\\E_?E^BE]wE^aE_ME^+@|,E_+qr,E`+_`MaCc,EaBE_\\E`+Te@f?,E_}E`+IH,E_hEa+tN,E`+sv,EaRE`jEbAEdmEb{Ec+^_,EbxHS+fr|,HT+BGJTY_mstv-},HU+?@-~,HV+?@-J,EccEboEc+J@,EdVEbbEcOEdpEcxEd+_A\\,EeCEdjEe+?W,EdwEcsEfKEe+FG,EfMEeHEd+ebx,Ee+Zfzjl,EfSEepEf+@I^,EeTEf_EeLEf~EgnEflEg+VW,EhdEfqEhCEg}Ei_Eh+OZ,EgtEiMEhxEg+|g,Eh+W{,Ei+POhVj,FKvFLQEm+@AFCQRLYZ`i,G|+jlp-rtuwvxy{},G}+@ACFJ,HV+KL-fk~,HW+FRWZ]_b-hj-lnov-y},HX+@BIMNP-RU-Y[-]_bdejl-prw-~,HY+?@-CFHI,G}+LMNWY,GzMEG+JVZ^a`dck,GFfFR+ns~,FS+NPR,ESsEV+mno,EW+IX,E\\qEW+BT?,FADEZvEW+\\sput,G?EEX+^S@NU`Vv,EY+CKf\\},EZ+Z[eh,Gs+qruz|,Gt+?DEGHFLTX,Gf+FI-KM-P,FHmFI^FH+\\en}~,FI+CJLNQ,EK+Gq,EMoHY+KMP-RTUYZ\\-eg-npqstvwyz~,HZ+ABGIJOPRSU-^`-fj-mo-qstwy-|~,H[+ABDI-KO-QSTV-Z\\^_,EO~ERWG?CEn+ir|tx,Eo+DFELTW-Y`hciq,EStET+Tj,FH+LQU,FGoGXaDGUGA+^[R{,E[IGA+|pjlsv,GB+fg-iZACXLV,E[OGB+\\jpsl,GC+LM,GB+q{,E[TGCQGpYGC+u]kWq,GD+GKRsXYp_h{|lf,D`LDitGE+GAP,EzTGE+bi,GFKE[eGFIGEzH[+`a-hjkmnpr-vy-|~,H\\+?@-PSTVWY[\\^bce-gi-qtv-z|-~,H]+?@-CE-IKM-ORT-VX-\\,GF@GEeEk+cvx,El+BEX,Hb+PQRTXY,EmrD|?EnAGfrEUOH|PEU+R{,EV+ECBKMQU,FA+?[U\\z,FB?FA+vjp,FB+gI,FC+ORUnp,FD+r[gDqIwy,FE+Wrtg_,FF+_Sfx,FG+\\g,F@kFCWFDeFExEG+}|,EH+BGH,FczFd+?EHZ[RYaV_nfy,Fe+DIYfr,D~+PO,H]+]^`ac-ikmoprt-~,H^+?@-dgm-qsv-~,H_+?@-M,E?{E@+\\Yf@Xb,EAjEC+EL,ED\\EE+h\\,EF+JP,EGEGA?G@~EqREruEv{F^+uw,F_+?HVWP,EUjF_+l[\\x-z^{dkbh,F`+MlUV,F_eF`+OFKi,Fa+ZRYF[`bqxd,Fb+SXHkq,FcDFbsFc+Rc]s,H}ZHz+xz{,FZpF[+CL,FZxF[+FGYaXletw,F\\+OPFBYg,H_+NO-~,H`+?@-m,F\\+ad~,F]LF\\|F]+?KP^_ot|,FSyFT+?MJGZqx,FUBF|+W`^,GhGF|+gspx,F}@F|}FZ+Ld,G_qHQ+DEFJIKLNOSVTY-[bcjilknoqsu-y{|~,HR+CG-MO-QT-VXWZ]-_acdfgi,H`+no-s,Ha+JMQTXbg-~,Hb+?@-LNOSUVZ-\\_-eh-~,Hc+?@-F,HR+hjmnr-tvx{|~,HS+BAEFHIL-NQ-UWZ\\-^aijhkpqsu-w{}~,HTAHStHT+CDEHKMNQ-SU-XZ]^\\`ac-knp-r,HSyF^+fk,HZHFf+Tlbj,FgEDtFFg+BA]S,Hc+GH-KMNP-ln-~,Hd+?@-RU-acerwxz},He+ABH,Fg+xv,FhPHzNHedFhoFY+GMRXc,FR+]_,FSkHw+_ag-kqpuwvxy},Hx+@ACE-HJKMPTVY-[]be-kplr,FU+QSU_\\kbrsw,FVCFU+po,FV+BAULbgecjf,FWBFV+p{~,FW+O?DKVIdWTX,He+KMY-cefh-~,Hf+?@-x,FW+Z{a_,FX?FW+lo~t,FXBFW+}r,FX+L]S[Ujn,F~IFjeFh+wx,Fi+?EGTe_kglr,G`+chq|~,Ga+Aa,GbEGa+v{,Gb+HaMbdp,GcYGb+{g}o,Gc+`XRZIsju,Gd+@ez,FUJGBdFY+qs,F^[G?+QSU[_ad-fhgpJt,G@+BELQhp,GeBH`wHa+?B,Hf+yz-~,Hg+?@-~,Hh+?@-X,Ha+HKLNSYZ]^`ade,GX+LSkm~y{z,GY+gLJk\\fbiRhu,GZCGYtGZMGY+oypn,GZ+HN,GYsGZ+hpqlrO,G[RGZ+]s^WP,G[+BF,GZwG[+GILHbz]dmY},G\\GG[+sphv~,G]AG[aG\\+|}z_oKm,G]JG\\+Rb{cXd,G]+Rng,G^QHh+YZ-jq,Hi+BHLMSTXeh-nq-txz|-~,Hj+BCE-IL-OQS-VX-]_a-df-ikmo-wy{-~,Hk+?@AC-E,G^EG]+GDlVBj,G^dG]+ktr,G^+JR,G]|G^+P?IZi_m,G_+UR,G^}G_+IZ`x{,F{uF|+ACD,GGOFj+y|,Fk+GBCTIjN,FlFFk+wiXmp_dcr}],Fl+WYDtK\\_mzaqp,Fm+Oefwk\\gDi[ajs,Fn+P@K\\Ydei,FoKFn+}{,Fo+NUJ,Hk+FH-MO-QS-]_-ac-mopr-y|-~,Hl+?EI-KMOQRT-z,Fo+^iew,Fp+@?,GF}GG+@AC,GFkG`CGG+`ablngjwzrs},GH+CHJNY^g,G`}Ga+DG,Gb+W^,Gd]F}+\\^fnoq,Fp{ETHFq+P\\[]aq{|,Fr+@FKLGDVg,GHmEYgF}~F~+MTd`ehmr,FrwFtvFu+em,FxFFyZHy+ws,GtrGu+CSPp,Gt+fl,Gp+FH,HD+IOMNc,Hl+{|-~,Hm+?@-~,Hn+?@-Z,HD+a`ohn|}qsx,HE+KDOLPabil-ntsy,GpTHx}GuwGvjGwDGx+Xh,Gu+t~{y,Gv+CUVY]MNZEkvwbxzc,GwHGv|Gw+S\\^kmbny,Gx?Gw+xt|p,Gx+H@APQIou{ns,Gy+DNSO[],GpwGq+AIDWS,EUZGf+U]Y[,Hn+[\\-~,Ho+?@-z,Gf+djn,Gg}GkeH\\RHZ+hrn,H[+E@GNMilo},H}+?BD-IK,Hz}H{+JL,HY+x{|,HZ+MQ,F]~HZ_HI+Mm,HJGHK}HLiHNIHMNHO}HPjHp~Hq+AD-G,FgbHq+JMO-QSTYZ]-bd-hjlmo-vy-|,Hr+CD-FIJ,Ho+{|-~,Hp+?@-z|},Hq+?BCHIKNRU-X\\iknx}~,Hr+?@AGHPQYZ_`K-OR-TV-X[\\^a,H\\{H]+DPQSnjbqs,Hi+pov,HxWHi+uy{,Hj+@?DAJKP,Hl+DBFHGLP,HbgHc+Lm,Hd+TS,Hj+^`enjzlx,Hk+GNR^b,Hy+|},FwzHy+AFGJQ,HNUHy+\\^,Hz+Z[\\_^ahfdin,H{+aknxv|},H|CHr+bc-~,Hs+?@-~,Ht+?@-~,Hu+?@-~,Hv+?@-~,Hw+?@-]cfmosz{,Hx+?LOQ-SUX\\^-admnqs-|,Hy+?@B-EHIK-PS-[]_-df-rt-vxy{~,Hz+?@-BD-GI-KOQRT-VXY]`bcegj-mo-wy|~,H{+?@-IKNPQS-UWY-^`b-jlmo-uwy{~,H|+?@-BD-NQ-},H}+@AL-W[-]`-d,NckNdxNeTNf+fp,Ng+KL-NPRSW^-`bcf-h,M_+TU-~,M`+?@-c"));

		// 以Unicode编码顺序排列的编码映射数组
		var data_sort_unicode = data_sort_gbk.slice(0).sort(function (a, b) { return a[0] - b[0]; });

		/**
		 * 查询映射码
		 * @param {uint32} charCode 
		 * @param {bool} isgbk 
		 */
		function search(charCode, isgbk) {
			var k = 0,
				v = 1,
				arr = data_sort_unicode;
			isgbk && (k = 1, v = 0, arr = data_sort_gbk);

			// 二分法搜索
			var i,
				b = 0,
				e = arr.length - 1;

			while (b <= e) {
				i = ~~((b + e) / 2);
				var _i = arr[i][k];
				if (_i > charCode) {
					e = --i;
				} else if (_i < charCode) {
					b = ++i;
				} else {
					return arr[i][v];
				}
			}
			return -1;
		}

		var gbk = {
			encode: function (str) {
				str += '';
				var gbk = [];
				var wh = '?'.charCodeAt(0);
				for (var i = 0; i < str.length; i++) {
					var charcode = str.charCodeAt(i);
					if (charcode < 0x80) gbk.push(charcode)
					else {
						var gcode = search(charcode)
						if (~gcode) {
							gbk.push(0xFF & (gcode >> 8), 0xFF & gcode);
						} else {
							gbk.push(wh);
						}
					}
				}
				return gbk;
			},
			decode: function (arr) {
				var kb = '', str = "";
				for (var n = 0, max = arr.length; n < max; n++) {
					var Code = arr[n];
					if (Code & 0x80) {
						Code = search(Code << 8 | arr[++n], true);
					}
					str += String.fromCharCode(Code);
				}
				return str;
			}
		};
		gbk.URI = require('../src/URI')(gbk);
		return gbk;
	}();
	
	return GBK;
}))
},{"../src/URI":2}],2:[function(require,module,exports){
module.exports = function(GBK){
	var passChars = '!\'()*-._~';	
	var otherPassChars = '#$&+,/:;=?@';
	function getModue(passChars){
		var passBits = passChars.split('').sort();
		var isPass = function (s){
			return ~passChars.indexOf(s) || /[0-9a-zA-Z]/.test(s)
		}
		return {
			encode:function(str){
				return (str+'').replace(/./g,function(v){
					if(isPass(v)) return v;
					var bitArr = GBK.encode(v);
					for(var i=0; i<bitArr.length; i++){
						bitArr[i] = '%' + ('0'+bitArr[i].toString(16)).substr(-2).toUpperCase();
					}
					return bitArr.join('');
				})
			},
			decode:function(enstr){
				return enstr.replace(/(%[\dA-Za-z]{2})+/g,function(a,b,c){
					var str = '';
					var arr = a.match(/.../g);
					for(var i=0; i < arr.length; i++){
						var hex = arr[i]
						var code = parseInt(hex.substr(1),16);
						if(code & 0x80){
							str += GBK.decode([code,parseInt(arr[++i].substr(1),16)])
						}else{
							var char = String.fromCharCode(code);
							if(isPass(char)){
								str += hex;
							}else{
								str += char;
							}
						}
					}
					return str;
				})
			}
		}
	}

	var URIComponent = getModue(passChars);
	var URI = getModue(passChars + otherPassChars);

	return {
		encodeURI:URI.encode,
		decodeURI:URI.decode,
		encodeURIComponent:URIComponent.encode,
		decodeURIComponent:URIComponent.decode
	}
};
},{}]},{},[1])