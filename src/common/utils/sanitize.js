const sanitizeInput = (data) => {
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) =>
      typeof value === "string" ? [key, value.trim()] : [key, value]
    )
  );
};

module.exports = { sanitizeInput };
