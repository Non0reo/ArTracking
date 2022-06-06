function slope(x1, y1, x2, y2){
    if (x1 == x2) //vertical line
        return [1, 0];
        
    return [(y2 - y1) / (x2 - x1), y1 - ((y2 - y1) / (x2 - x1)) * x1];
    //y = mx + b
    //y - mx = b
  }

  //Return en meeting point of two lines
  function getMeetingPoint(line1, line2){
    let x1 = line1[0];
    let y1 = line1[1];
    let x2 = line1[2];
    let y2 = line1[3];
    let x3 = line2[0];
    let y3 = line2[1];
    let x4 = line2[2];
    let y4 = line2[3];
    let m1 = slope(x1, y1, x2, y2);
    let m2 = slope(x3, y3, x4, y4);
    let b1 = m1[1];
    let b2 = m2[1];
    let x = (b2 - b1) / (m1[0] - m2[0]);
    let y = m1[0] * x + b1;
    if (x1 == x2) return [x1, y];
    else if (x3 == x4) return [x3, y];
    else return [x, y];
  }