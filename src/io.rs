use crate::source_model::SourceModel;
use std::error::Error;

pub fn read_data_from_string(source: String) -> Result<SourceModel, Box<dyn Error>> {
    let data = serde_json::from_str(source.as_str())?;
    Ok(data)
}
