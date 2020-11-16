const DEFAULTS = { stiffness: 0.15, damping: 0.8, precision: 0.01 };

const springToTickValue = (frames, out = false) => t => {
  t = out ? 1 - t : t;
  const indexPrecise = t * frames.length;
  const indexExcess = indexPrecise % 1;

  const index = Math.min(~~indexPrecise, frames.length - 1);

  const a = frames[index];
  const b = frames[index + 1] == null ? a : frames[index + 1];
  return indexExcess ? a + (b - a) * indexExcess : a;
};

export function springIn(from, to, springOptions){
  return springToTransition(false, from, to, springOptions);
}

export function springOut(from, to, springOptions){
  return springToTransition(true, from, to, springOptions);
}

function springToTransition(out, from, to, springOptions) {
  const frames = springFrames(from, to, springOptions)
  return {
    duration: (frames.length * 1000) / 60,
    tickToValue: springToTickValue(frames, out),
  };
}

function is_date(obj) {
	return Object.prototype.toString.call(obj) === '[object Date]';
}

export function springFrames(from, to, opts) {
  opts = Object.assign({}, DEFAULTS, opts);

  let value = from;
  let last_val = from;
  let dt = 1;
  const values = [from];

  let ctx;
  do {
    ctx = {
      inv_mass: 1,
      opts,
      settled: true,
      dt,
    };

    const next_value = tick_spring(ctx, last_val, value, to);
    values.push(next_value);
    last_val = value;
    value = next_value;
  } while (!ctx.settled);

  return values;
}

function tick_spring(ctx, last_value, current_value, target_value) {
  if (typeof current_value === "number" || is_date(current_value)) {
    const delta = target_value - current_value;

    const velocity = (current_value - last_value) / (ctx.dt || 1 / 60); // guard div by 0
    const spring = ctx.opts.stiffness * delta;
    const damper = ctx.opts.damping * velocity;
    const acceleration = (spring - damper) * ctx.inv_mass;
    const d = (velocity + acceleration) * ctx.dt;

    if (Math.abs(d) < ctx.opts.precision && Math.abs(delta) < ctx.opts.precision) {
      return target_value; // settled
    } else {
      ctx.settled = false; // signal loop to keep ticking
      return is_date(current_value) ? new Date(current_value.getTime() + d) : current_value + d;
    }
  } else if (Array.isArray(current_value)) {
    return current_value.map((_, i) => tick_spring(ctx, last_value[i], current_value[i], target_value[i]));
  } else if (typeof current_value === "object") {
    const next_value = {};
    for (const k in current_value) next_value[k] = tick_spring(ctx, last_value[k], current_value[k], target_value[k]);
    return next_value;
  } else {
    throw new Error(`Cannot spring ${typeof current_value} values`);
  }
}
