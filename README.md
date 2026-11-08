# PySpark Mini Projects

A collection of small PySpark practice projects created while learning distributed data processing. The repository currently contains student-data transformations and an office-data notebook.

## Projects

### 1. Student data analysis

Path: `MiniProject1/`

- Input: `StudentData.csv`
- Script: `student.py`
- Practice areas: RDD transformations, filtering, aggregations, pass/fail counts, course-level totals, averages, minimums, and maximums.

The script originated in Google Colab and contains an environment-specific input path. Update that path for your environment before running it. Review the script for unfinished variables and fix them before execution.

### 2. Office data transformations

Path: `MiniProject2/project2/`

- Notebook: `MiniProject2.ipynb`
- Input: `OfficeDataProject.csv`
- Practice area: data transformation with PySpark.

The notebook was developed in a notebook/Colab-style environment. Review its file paths and Spark setup before running locally.

## Requirements

- Python 3
- Apache Spark with PySpark
- Jupyter Notebook or Google Colab (for the notebook project)

Install PySpark in a local Python environment:

```bash
python -m pip install pyspark
```

## Run the student project

After updating the CSV path in `MiniProject1/student.py` and checking the script for unfinished code:

```bash
python MiniProject1/student.py
```

For the second project, open `MiniProject2/project2/MiniProject2.ipynb` in Jupyter or Colab and update the dataset path if needed.

## Repository layout

```text
MiniProject1/
  StudentData.csv
  student.py
MiniProject2/
  project2/
    OfficeDataProject.csv
    MiniProject2.ipynb
README.md
```

Generated Spark output, local checkpoints, archives, and environment files should not be committed.

## Notes

These are learning projects rather than production pipelines. Paths and code may require environment-specific adjustments before execution.

## License

No license is currently specified. Contact the repository owner before reusing the contents.
