export const handleError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    return 'No response from server';
  } else {
    return error.message;
  }
};

export const validatePollForm = (pollTitle, options) => {
  let titleError = "";
  let optionsError = "";

  if (pollTitle.length < 10) {
    titleError = "Poll title must be at least 10 characters long.";
  }
  const validOptions = options.filter((option) => {
    const content = typeof option === 'string' ? option : option.optionTitle;
    return content && content.trim() !== "";
  });
  if (validOptions.length < 2) {
    optionsError = "At least 2 valid options are required.";
  } else if (options.some((option) => !option.optionTitle || !option.optionTitle.trim())) {
    optionsError = "Please remove or fill in empty options.";
  }

  return { titleError, optionsError };
};
