(() => {
  var result = { text: null, csv: null, md: null, tbl: null };
  var elements = {};

  function getEl(q) {
    if (!elements[q]) {
      elements[q] = document.querySelector(q);
      // console.log(elements[q]);
    }
    return elements[q];
  }

  function round(n, p) {
    return parseFloat(n.toFixed(p));
  }

  getEl("#doaction").addEventListener("click", (e) => {
    let pa = extract_params();
    let r = calc(pa);
    display_results(r, pa.round);
    e.preventDefault();
    e.stopPropagation();
  });

  document.querySelectorAll(".one_tab").forEach((e) => {
    e.addEventListener("click", (e) => {
      getEl("#result_frame").dataset.show = e.target.dataset.switch;
      e.preventDefault();
      e.stopPropagation();
    });
  });

  function extract_params() {
    let para = {};
    //scale length
    para.scale = parseFloat(getEl("#scale").value);
    //frets
    para.frets = parseInt(getEl("#frets").value);
    //round
    para.round = parseInt(getEl("#round").value);
    // rule
    let sel = getEl("#rule");
    para.rule = parseFloat(sel.value);
    //
    // console.log(para);
    return para;
  }

  function display_results(arr, rn = 2) {
    const ful = arr.map((e, i, a) => {
      return {
        fret: i,
        length: round(e, rn),
        step: i == 0 ? 0 : round(a[i - 1] - e, rn),
      };
    });
    //
    // console.log(ful);
    // text
    let text_str = "fret: length (step)\n\n";
    ful.forEach((f) => {
      text_str += `${f.fret}: ${f.length} (${f.step})
`;
    });

    let csv_str = "fret,length,step\n";
    ful.forEach((f) => {
      csv_str += `${f.fret},${f.length},${f.step}
`;
    });

    let md_str = "| Fret # | Length | Step |\n|---|---|---|\n";
    ful.forEach((f) => {
      md_str += `| ${f.fret} | ${f.length} | ${f.step} |
`;
    });

    let tbl_str = "fret\tlength\tstep\n";
    ful.forEach((f) => {
      tbl_str += `${f.fret}\t${f.length}\t${f.step}
`;
    });

    getEl("pre.text").innerHTML = text_str;
    getEl("pre.csv").innerHTML = csv_str;
    getEl("pre.md").innerHTML = md_str;
    getEl("pre.tbl").innerHTML = tbl_str;
  }

  //logic
  function calc(P) {
    let lengths = [];
    let L = P.scale;
    for (let n = 0; n <= P.frets; n++) {
      lengths.push(L);
      L = L - L / P.rule;
    }
    return lengths; //.map((e) => parseFloat(e.toFixed(P.round)));
  }
})();
